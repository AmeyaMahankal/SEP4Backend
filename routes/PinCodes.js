const express = require('express');
const router = express.Router();
const net = require('net'); 

const PinCodeModel = require('../model/PinCodeModel');
const MotionModel= require('../model/MotionModel') 

router.post('/comparePin', async (req, res) => {
    const handleTcpClient = async () => {
        const client = new net.Socket();
        const serverAddress = '10.27.11.3';
        const serverPort = 23;

        return new Promise((resolve, reject) => {
            client.connect(serverPort, serverAddress, () => {
                console.log('Connected to TCP server');
                client.write('ChangeSecurityStatus');
            });

            client.on('error', (error) => {
                console.error('Error in TCP socket connection:', error);
                reject(error);
                client.end();
            });

            client.on('close', () => {
                console.log('Connection to TCP server closed');
            });

            client.on('data', async (data) => {
                console.log('Received data from TCP server:', data.toString());
                if (data.includes("SSCRemote")) {
                    try {
                        const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

                        if (latestMotionData) {
                            latestMotionData.detection = !latestMotionData.detection;
                            await latestMotionData.save();
                        } else {
                            res.status(404).json({ message: 'No data to update' });
                        }
                    } catch (error) {
                        res.status(500).json({ message: error.message });
                    }

                    client.end();
                }

                resolve(data.toString());
            });
        });
    };

    try {
        const enteredPin = req.body.pinCode;

        if (!enteredPin) {
            return res.status(400).json({ error: 'Please provide a pin code.' });
        }

        const storedPin = await PinCodeModel.findOne({});

        if (!storedPin) {
            return res.status(404).json({ error: 'No pin code found in the database.' });
        }

        const isMatch = enteredPin == storedPin.pinCode;

        if (isMatch) {
            const tcpResponse = await handleTcpClient();

            const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

            if (latestMotionData) {
                const responseMessage = latestMotionData.detection ? 'Unlocked!' : 'Locked!';
                res.json({ message: responseMessage, tcpResponse });
            } else {
                res.status(404).json({ message: 'No motion data found.' });
            }
        } else {
            res.status(401).json({ error: 'Pin codes do not match.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.patch('/update-pin', async (req, res) => {
    try {
        const newPinCode = req.body.pinCode;

        if (!newPinCode) {
            return res.status(400).json({ error: 'Please provide a new pin code.' });
        }

        // TCP client logic directly within the endpoint
        const client = new net.Socket();
        const serverAddress = '10.27.11.3';
        const serverPort = 23;

        const handleTcpClient = () => {
            return new Promise((resolve, reject) => {
                client.connect(serverPort, serverAddress, () => {
                    console.log('Connected to TCP server');

                    // Send the new pin code to the server
                    client.write(`update pincode to ${newPinCode}`);
                });

                client.on('error', (error) => {
                    console.error('Error in TCP socket connection:', error);
                    reject(error);

                    client.end();
                });

                client.on('close', () => {
                    console.log('Connection to TCP server closed');
                    resolve('TCP request successful');
                });

                client.on('data', (data) => {
                    console.log('Received data from TCP server:', data.toString());
                    console.log('s');

                    // Check if the received message is "updated"
                    if (data.toString().trim().includes('updated')) {
                        resolve('Acknowledgment received');
                    } else {
                        reject('Invalid acknowledgment');
                    }
                });
            });
        };

        try {
            // Wait for the acknowledgment from the server
            await handleTcpClient();

            // Database update code removed

            // Respond to the client without updating the database
            res.json({ message: 'Pin code update acknowledged by the server' });
        } catch (error) {
            // Handle errors from the TCP client or database update
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});







module.exports = router;