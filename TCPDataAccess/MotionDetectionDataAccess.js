const Model = require('../model/MotionDetectionModel')

async function motionDetectData(timestamp, formattedDate) {
    const data = new Model(
        {
            warning: "Movement Detected on " + formattedDate,
            time: timestamp
        }
    )

    const dataToSave = await data.save();

}

module.exports = motionDetectData;