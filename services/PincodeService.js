const net = require('net');
const PinCodeModel = require('../model/PinCodeModel');
const MotionModel = require('../model/MotionModel');

class PincodeService {
    async comparePin(enteredPin) {
        try {
            if (!enteredPin) {
                throw new Error('Please provide a pin code.');
            }

            const storedPin = await PinCodeModel.findOne({});

            if (!storedPin) {
                throw new Error('No pin code found in the database.');
            }

            const isMatch = enteredPin == storedPin.pinCode;

            if (isMatch) {
                const tcpResponse = await this.handleTcpClient('10.25.11.8', 23, 'ChangeSecurityStatus');

                const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

                if (latestMotionData) {
                    latestMotionData.detection = !latestMotionData.detection;
                    await latestMotionData.save();
                    const responseMessage = latestMotionData.detection ? 'Unlocked!' : 'Locked!';
                    return { message: responseMessage, tcpResponse };
                } else {
                    throw new Error('No motion data found.');
                }
            } else {
                throw new Error('Pin codes do not match.');
            }
        } catch (error) {
            throw error;
        }
    }

    async updatePin(newPinCode) {
        try {
            if (!newPinCode) {
                throw new Error('Please provide a new pin code.');
            }

            const tcpResponse = await this.handleTcpClient('10.25.11.8', 23, `update pincode to ${newPinCode}`);

            // Database update code removed

            // Example response:
            return { message: 'Pin code update acknowledged by the server', tcpResponse };
        } catch (error) {
            throw error;
        }
    }

    async handleTcpClient(serverAddress, serverPort, message) {
        try {
            const client = new net.Socket();

            return new Promise((resolve, reject) => {
                client.connect(serverPort, serverAddress, () => {
                    console.log('Connected to TCP server');
                    client.write(message);
                });

                client.on('error', (error) => {
                    console.error('Error in TCP socket connection:', error);
                    reject(error);
                    client.end();
                });

                client.on('close', () => {
                    console.log('Connection to TCP server closed');
                });

                client.on('data', (data) => {
                    console.log('Received data from TCP server:', data.toString());
                    resolve(data.toString());
                    client.end();
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PincodeService();
