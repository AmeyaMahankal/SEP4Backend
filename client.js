const net = require('net');

const client = new net.Socket();

const PORT = 3001;
const SERVER_IP = '127.0.0.1'; // Change this to the IP address of your server if it's not running locally

client.connect(PORT, SERVER_IP, () => {
  console.log('Connected to TCP server');

  // Handle data received from the server
  client.on('data', (data) => {
    try {
      const receivedData = JSON.parse(data.toString());
      console.log(`Received motion data from server: ${receivedData.detection}`);
    } catch (error) {
      console.error('Error parsing received data:', error.message);
    }
  });

  // Handle the connection being closed
  client.on('close', () => {
    console.log('Connection to server closed');
  });
});

// Handle errors during connection
client.on('error', (err) => {
  console.error(`Error connecting to server: ${err.message}`);
});

// Handle the client's termination
process.on('SIGINT', () => {
  client.destroy();
  console.log('Client terminated');
  process.exit();
});
