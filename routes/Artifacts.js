const express = require('express');
const aModel = require('../model/ArtifactModel');

const router = express.Router();

// POST endpoint to save humidity data
router.post('/postArtifact', async (req, res) => {
  const data = new aModel({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    minTemp: req.body.minTemp,
    maxTemp: req.body.maxTemp,
    maxLight: req.body.maxLight,
    minHumidity: req.body.minHumidity,
    maxHumidity: req.body.maxHumidity,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint to retrieve humidity data
router.get('/getAllArtifacts', async (req, res) => {
    try {
      const allArtifacts = await aModel.find();
      res.json(allArtifacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.delete('/deleteart/:name', async (req, res) => {
  try {
      const name = req.params.name;
      const data = await aModel.findOneAndDelete({ name: name });
      if (data) {
          res.send(`Document with name ${data.name} has been deleted.`);
      } else {
          res.status(404).send("Document not found.");
      }
  }
  catch (error) {
      res.status(400).json({ message: ("param is" + req.params.name) });
  }
});





module.exports = router;
