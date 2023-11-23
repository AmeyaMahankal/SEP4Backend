const express = require('express');
const net = require('net');
const mongoose = require('mongoose');
const axios = require('axios');
const motionModel = require('./model/MotionModel');

const app = express();

mongoose.connect("mongodb+srv://ameyamahankal:4mq7FaDOD8LzQg18@cluster0.sjpz1jh.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sendMotionDataToClient = async (socket) => {
  try {
    while (true) {
      const response = await axios.get('http://localhost:3000/motion/getMotion');
      const detectionValue = response.data.detection;

      // Log to confirm that data is being fetched
      console.log(`Fetched motion data from Express server: ${detectionValue}`);

      // Send the motion data to the connected TCP client as JSON
      const jsonData = JSON.stringify({ detection: detectionValue });
      socket.write(jsonData);

      // Introduce a delay before sending the next data (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error getting motion data from Express server:', error.message);
  }
};

const server = net.createServer((socket) => {
  console.log('Client connected');

  // Send motion data to the client continuously when it connects
  sendMotionDataToClient(socket);

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`TCP Server running on port ${PORT}`);
});

app.get('/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

const expressPort = 4000;
app.listen(expressPort, () => {
  console.log(`Express Server running on port ${expressPort}`);
});
