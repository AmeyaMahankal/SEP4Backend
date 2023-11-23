const express = require('express');
const lightService = require('../services/lightService');

const router = express.Router();

// Post method
router.post('/post', async (req, res) => {
  const { lightLevel, time } = req.body;

  try {
    const dataToSave = await lightService.saveLightLevel(lightLevel, time);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all light levels
router.get('/getLightLevels', async (req, res) => {
    try {
      const data = await lightService.getAllLightLevels();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
