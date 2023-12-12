const motionModel = require('../model/MotionModel');
const net = require('net');

class MotionService {
  async saveMotion(detection) {
    const data = new motionModel({ detection });

    try {
      const dataToSave = await data.save();
      return dataToSave;
    } catch (error) {
      throw error;
    }
  }

  async getAllMotions() {
    try {
      const data = await motionModel.find().sort({ time: -1 });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateMotionStatus() {
    const client = new net.Socket();
    const serverAddress = '0.0.0.0';
    const serverPort = 23;

    return new Promise((resolve, reject) => {
      client.connect(serverPort, serverAddress, () => {
        client.write('ChangeSecurityStatus');
      });

      client.on('data', async (data) => {
        if (data.toString() === 'SSCRemote') {
          try {
            const latestMotionData = await motionModel.findOne().sort({ time: -1 });

            if (latestMotionData) {
              latestMotionData.detection = !latestMotionData.detection;
              await latestMotionData.save();
              resolve({ message: 'Motion status updated successfully' });
            } else {
              reject({ status: 404, message: 'No data to update' });
            }
          } catch (error) {
            reject({ status: 500, message: error.message });
          }

          client.end();
        }
      });

      client.on('error', (error) => {
        reject({ status: 500, message: 'Internal Server Error', error });
        client.end();
      });

      client.on('close', () => {
        console.log('Connection to TCP server closed');
      });
    });
  }
}

module.exports = new MotionService();
