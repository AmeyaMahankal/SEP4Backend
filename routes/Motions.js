const express = require('express');
const motionService = require('../services/MotionService');

const router = express.Router();

router.post('/post', async (req, res) => {
  const { detection } = req.body;

  try {
    const dataToSave = await motionService.saveMotion(detection);
    res.status(200).json(dataToSave);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getMotions', async (req, res) => {
  try {
    const data = await motionService.getAllMotions();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/updateMotion', async (req, res) => {
  try {
    const updatedData = await motionService.updateMotionStatus();
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
