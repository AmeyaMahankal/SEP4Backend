const express = require('express');
const AngleAndDistModel = require('../model/AngleAndDistModel');

const router = express.Router();


// POST 
router.post('/postAngleAndDistance', async (req, res) => {
    const data = new AngleAndDistModel({
        distance: req.body.distance,
        angle: req.body.angle,
    });

    try {
        const savedData = await data.save();
        res.status(200).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET
router.get('/getAngleAndDistance', async (req, res) => {
    try {
        const data = await AngleAndDistModel.find().sort({ time: -1 }).limit(1);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
