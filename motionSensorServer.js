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

      console.log(`Fetched motion data from Express server: ${detectionValue}`);

      const jsonData = JSON.stringify({ detection: detectionValue });
      socket.write(jsonData);

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


