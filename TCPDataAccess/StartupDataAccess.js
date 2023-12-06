const PinCodeModel = require('../model/PinCodeModel');
const MotionModel = require('../model/MotionModel');

async function startUp() {
    try {
        // Update Pin Code
        const updatedPin = await PinCodeModel.findOneAndUpdate({}, { pinCode: 1234 }, { new: true });

        // Update Motion Data
        const latestMotionData = await MotionModel.findOne().sort({ time: -1 });
        if (latestMotionData) {
            latestMotionData.detection = false;
            await latestMotionData.save();
        } else {
            console.error('No motion data found.');
        }

    } catch (error) {
        console.error('Error updating pin and motion data:', error);
        // You may choose to throw the error or handle it in a different way based on your requirements
    }
}

module.exports = startUp;