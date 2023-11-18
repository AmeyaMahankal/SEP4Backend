const express = require('express');
const hModel = require('../model/HumidityModel');

const router = express.Router();

router.post('/posthumidity', async (req, res) => {
  const data = new hModel({
    measurment: req.body.measurment,
    time: req.body.time,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/getHumidities', async (req, res) => {
    try {
        const data = await hModel.find().sort({ time: -1 }).limit(1);
        res.json(data)
    } catch (error) {

    }
})


module.exports = router;