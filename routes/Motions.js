const express = require("express");
const net = require("net");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
const MotionModel = require("../model/MotionModel");

const router = express.Router();

const sendMotionDataToClient = async (socket, detectionValue) => {
  try {
    console.log(`Sending updated motion data to client: ${detectionValue}`);
    
    const jsonData = JSON.stringify({ detection: detectionValue });

    // Send motion data to the client and wait for acknowledgment
    socket.write(jsonData);

    // Wait for acknowledgment from the client
    const ackBuffer = Buffer.alloc(2);
    await new Promise((resolve) => {
      socket.once("data", (data) => {
        data.copy(ackBuffer);
        resolve();
      });
    });

   
  } catch (error) {
    console.error("Error sending motion data to client:", error.message);
  }
};

const connectedSockets = [];

const handleClientDisconnect = (socket) => {
  console.log("Client disconnected");

  // Remove the disconnected socket from the list
  connectedSockets.splice(connectedSockets.indexOf(socket), 1);
};

const server = net.createServer((socket) => {
  console.log("Client connected");

  connectedSockets.push(socket);

  // Handle data received from the client
  socket.on("data", (data) => {
    // Assuming the acknowledgment is a simple 2-byte message
    console.log(`Received acknowledgment from the client: ${data.toString()}`);
  });

  sendMotionDataToClient(socket);

  socket.on("end", () => {
    handleClientDisconnect(socket);
  });

  socket.on("error", (error) => {
    console.error("Client connection error:", error.message);
    handleClientDisconnect(socket);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`TCP Server running on port ${PORT}`);
});

app.get("/status", (req, res) => {
  res.json({ status: "Server is running" });
});

router.get("/getMotion", async (req, res) => {
  try {
    const motion = await MotionModel.findOne().sort({ time: -1 });

    if (motion) {
      res.json({ detection: motion.detection });
    } else {
      res.status(404).json({ message: "No data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.patch("/updateMotion", async (req, res) => {
  try {
      const { detection } = req.body;

      const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

      if (latestMotionData) {
          // Send the patch request to the client and wait for acknowledgment
          const acknowledgmentPromises = connectedSockets.map((socket) => {
              return new Promise((resolve, reject) => {
                  socket.once("data", async (data) => {
                      const acknowledgment = data.toString();
                      console.log(`Received acknowledgment from client: ${acknowledgment}`);

                      try {
                          // Check if the acknowledgment matches the expected format
                          const expectedAck =
                              String(detection).toLowerCase() === 'true' ? 't' :
                              String(detection).toLowerCase() === 'false' ? 'f' :
                              '';

                          console.log(`Expected acknowledgment format: ${expectedAck}`);

                          if (acknowledgment.toLowerCase() === expectedAck) {
                              // Perform the update logic here
                              latestMotionData.detection = detection;
                              await latestMotionData.save();
                              resolve();
                          } else {
                              console.error(`Unexpected acknowledgment format: ${acknowledgment}`);
                              reject(new Error(`Unexpected acknowledgment format: ${acknowledgment}`));
                          }
                      } catch (updateError) {
                          console.error(`Error updating database: ${updateError.message}`);
                          resolve(); // Resolve even if there is an error updating the database
                      }
                  });
              });
          });

          // Trigger sending motion data to all connected clients
          connectedSockets.forEach(async (socket) => {
              await sendMotionDataToClient(socket, detection);
          });

          // Wait for all acknowledgment promises to resolve
          await Promise.all(acknowledgmentPromises);

          // Respond after all clients have acknowledged
          res.json({ message: 'Motion status updated successfully' });
      } else {
          res.status(404).json({ message: 'No data to update' });
      }
  } catch (error) {
      console.error(`Error in patch request: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;