const express = require('express');
const humidityService = require('../services/HumidityService');

const router = express.Router();

router.post('/post', async (req, res) => {
  const {measurment, time} = req.body;

  try{
    const dataToSave= await humidityService.saveHumidity(measurment,time);
    res.status(200).json(dataToSave);
    
  }catch (error) {
    res.status(500).json ({ error: error.message});
  }
});
 

router.get('/getHumidities', async (req, res) => {
  try{
    const data = await humidityService.getAllHumidities();
    res.json(data);
  }catch (error) {
    res.status(500).json({ error: error.message});
  }
});

module.exports = router; 