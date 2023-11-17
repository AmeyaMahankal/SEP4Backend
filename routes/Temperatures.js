const express = require('express');
const tempModel = require('../model/TemperatureModel');

const router = express.Router()

router.post('/post', async (req, res) => {

    const data = new tempModel(
        {
            temperature: req.body.temperature,
            time: req.body.time
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
router.get('/getTemperatures', async (req, res) => {
    try {
        const data = await tempModel.find().sort({ time: -1 }).limit(1);
        res.json(data)
    } catch (error) {

    }
})

module.exports = router;