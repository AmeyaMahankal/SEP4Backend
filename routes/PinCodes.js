const express = require('express');
const router = express.Router();
const net = require('net'); 

const PinCodeModel = require('../model/PinCodeModel');
const MotionModel= require('../model/MotionModel') 

router.post('/comparePin', async (req, res) => {
    const handleTcpClient = () => {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const serverAddress = '192.168.214.90';
            const serverPort = 23;

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
                if (data == "SSCRemote") {
                    try {
    
                        const latestMotionData = await MotionModel.findOne().sort({ time: -1 });
    
                        if (latestMotionData) {
                            latestMotionData.detection = !latestMotionData.detection;
                            await latestMotionData.save();
    
                           // res.json({ message: 'Motion status updated successfully' });
                        } else {
                            res.status(404).json({ message: 'No data to update' });
                        }
                    } catch (error) {
                        res.status(500).json({ message: error.message });
                    }
    
                    client.end();
    
                };
                
                

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

            res.json({ message: 'Unlocked!', tcpResponse });
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
      const serverAddress = '192.168.214.90';
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
                  if (data.toString().trim() === 'updated') {
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

          // Update the PIN code in the database
          const updatedPin = await PinCodeModel.findOneAndUpdate({}, { pinCode: newPinCode }, { new: true });

          if (!updatedPin) {
              return res.status(404).json({ error: 'No pin code found in the database.' });
          }

          res.json({ message: 'Pin code updated successfully', updatedPin, confirmation: 'Pin code updated and acknowledged by the server' });
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