const express = require('express');
const Model = require('../model/MotionDetectionModel');

const router = express.Router()

router.post('/postDetect', async (req, res) => {

    var timestamp = Date.now();

    // Create a new Date object using the timestamp
    var currentDate = new Date(timestamp);

    // Get the various components of the date
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    var day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Create the formatted date string
    var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const data = new Model(
        {
            warning: "Movement Detected on " + formattedDate,
            time: timestamp
        }
    )
    try {
        const dataToSave = await data.save();
        res.status(200).json(data)
    } catch (error) {
        res.status(200).json(dataToSave)
    }

})

//Get all Method
router.get('/getDetects', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    } catch (error) {

    }
})

module.exports = router;