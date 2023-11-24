const net = require('net');

const TCP_SERVER_PORT = 3001;
const TCP_SERVER_HOST = 'localhost';

const client = new net.Socket();

client.connect(TCP_SERVER_PORT, TCP_SERVER_HOST, () => {
    console.log('Connected to TCP server');

    // Function to send back the value to the server
    const sendBackValue = (value) => {
        console.log(`Sending back value to server: ${value}`);
        client.write(value);
    };

    // Event listener for data received from the server
    client.on('data', (data) => {
        const receivedValue = data.toString();
        console.log(`Received value from server: ${receivedValue}`);

        // Send back the received value to the server
        sendBackValue(receivedValue);
    });

    // Event listener for connection close
    client.on('close', () => {
        console.log('Connection to TCP server closed');
    });

    // Event listener for connection error
    client.on('error', (error) => {
        console.error('Client connection error:', error.message);
        client.end();
    });
});

// Handle the case where the client disconnects
client.on('end', () => {
    console.log('Connection to TCP server ended');
});

// Handle errors during the connection
client.on('error', (error) => {
    console.error('Client connection error:', error.message);
    client.end();
});
