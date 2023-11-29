const express = require('express');
const tempService = require('../services/TemperatureService');

const router = express.Router()

router.post('/post', async (req, res) => {
    const { temperature, time} = req.body;

    try{
        const dataToSave = await tempService.saveTemperature(temperature, time);
        res.status(200).json(dataToSave);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
});


router.get('/getTemperatures', async (req, res) => {
    try{
        const data = await tempService.getAllTemperatures();
        res.json(data);
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
});


module.exports = router;