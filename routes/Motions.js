const express = require('express');
const MotionModel = require('../model/MotionModel');
const net = require('net');

const router = express.Router();


router.post('/motion', async (req, res) => {
    try {

        const { detection } = req.body;

        const newMotionData = new MotionModel({ detection });


        await newMotionData.save();

        res.status(200).json({ message: 'Motion data saved' });
    } catch (error) {
        console.error('Error saving motion data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//GET

router.get('/getMotion', async (req, res) => {
    try {
        const motion = await MotionModel.findOne().sort({ time: -1 });

        if (motion) {
            res.json({ detection: motion.detection });
        } else {
            res.status(404).json({ message: 'no data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;

// PATCH

router.patch('/updateMotion', async (req, res) => {
    try {
        // Connect to the TCP server
        const client = new net.Socket();
        const serverAddress = '192.168.214.98';
        const serverPort = 23;

        client.connect(serverPort, serverAddress, () => {
            console.log('Connected to TCP server');

            // Send a message to the TCP server
            client.write('ChangeSecurityStatus');
        });

        // Set up event handlers for data received from the TCP server
        client.on('data', async (data) => {
            // Print the received data to the console
            console.log('Received data from TCP server:', data.toString());

            if (data == "SSCRemote") {
                try {


                    const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

                    if (latestMotionData) {
                        latestMotionData.detection = !latestMotionData.detection;
                        await latestMotionData.save();

                        res.json({ message: 'Motion status updated successfully' });
                    } else {
                        res.status(404).json({ message: 'No data to update' });
                    }
                } catch (error) {
                    res.status(500).json({ message: error.message });
                }

                client.end();

            }

            // Close the connection after receiving the data
        });

        // Handle socket connection errors
        client.on('error', (error) => {
            console.error('Error in TCP socket connection:', error);
            res.status(500).json({ error: 'Internal Server Error' });

            // Close the connection in case of an error
            client.end();
        });

        // Handle the socket connection closure
        client.on('close', () => {
            console.log('Connection to TCP server closed');
        });
    } catch (error) {
        // Handle other errors in your try-catch block if needed
        console.error('Error in /getTemperatures endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;


