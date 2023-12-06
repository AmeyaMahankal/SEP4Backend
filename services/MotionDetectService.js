const motionDetectModel = require('../model/MotionDetectionModel');

class MotionDetectService {
    async saveMotionDetect() {
        var timestamp = Date.now();
        var currentDate = new Date(timestamp);

        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var day = currentDate.getDate().toString().padStart(2, '0');
        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var seconds = currentDate.getSeconds().toString().padStart(2, '0');

        var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const data = new motionDetectModel({
            warning: "Movement Detected on " + formattedDate,
            time: timestamp
        });

        try {
            const dataToSave = await data.save();
            return dataToSave;
        } catch (error) {
            throw error;
        }
    }

    async getAllMotionDetects() {
        try {
            const data = await motionDetectModel.find();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MotionDetectService();
