// motionDetectRoute.js
const express = require('express');
const motionDetectService = require('../services/MotionDetectService');

const router = express.Router();

// Post Method
router.post('/postDetect', async (req, res) => {
    try {
        const dataToSave = await motionDetectService.saveMotionDetect();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Method
router.get('/getDetects', async (req, res) => {
    try {
        const data = await motionDetectService.getAllMotionDetects();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
