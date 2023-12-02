const net = require("net");
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const motionDetectLogic = require("./TCPLogic/MotionDetectionApplication");
const conditionLogic = require("./TCPLogic/ConditionsApplication");
const MotionModel = require("./model/MotionModel");

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const clients = [];

const server = net.createServer((socket) => {
  console.log("someone connected :3");

  clients.push(socket);

  socket.on("data", async (data) => {
    console.log(`Received from client: ${data.toString()}`);

    if (data.toString() == "ChangeSecurityStatus") {
      clients.forEach((client) => {
        if (client !== socket) {
          client.write("ChangeSecurityStatus");
        }
      });
    } else if (data.includes("SSCRemote")) {
      clients.forEach((client) => {
        if (client !== socket) {
          client.write("SSCRemote");
        }
      });
    } else if (data.includes("SSCLocal")) {
      const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

      if (latestMotionData) {
        latestMotionData.detection = !latestMotionData.detection;
        await latestMotionData.save();
      }
    } else if (data.includes("MOTION DETECTED")) {
      motionDetectLogic();
    } else if (data.includes("update pincode to")) {
      // Extract the new pin code from the message
      const newPinCode = data
        .toString()
        .replace("update pincode to", "")
        .trim();
      // Broadcast the new pin code to all connected clients
      clients.forEach((client) => {
        if (client !== socket) {
          client.write(`New pin code: ${newPinCode}`);
        }
      });
    } else if (data.toString().includes("updated")) {
      // If the client sends "updated," broadcast it to all connected clients
      clients.forEach((client) => {
        if (client !== socket) {
          client.write("updated");
        }
      });
      // Close the communication with the client
      socket.end();
    } else if (data.toString().charAt(0) === "T") {
      conditionLogic(data.toString());
      console.log("savedData");
    }

    //T=24.1/H=41/L=833
    //Temp = 24.1
    //humidity = 41%
    //Light = 833
  });

  socket.on("end", () => {
    console.log("Client disconnected.");

    // Remove the disconnected client from the array
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  server.on("error", (err) => {
    console.error("Server error ,", err);
  });
});

const host = "192.168.214.90"; //ip

const port = 23; //port

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
