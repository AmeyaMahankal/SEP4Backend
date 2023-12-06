const express = require('express');
const artifactService = require('../services/ArtifactService');

const router = express.Router();

router.post('/postArtifact', async (req, res) => {
  try {
    const dataToSave = await artifactService.saveArtifact(req.body);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/getAllArtifacts', async (req, res) => {
  try {
    const allArtifacts = await artifactService.getAllArtifacts();
    res.json(allArtifacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/deleteArtifact/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const deletedArtifact = await artifactService.deleteArtifact(name);

    if (deletedArtifact) {
      res.send(`Document with name ${deletedArtifact.name} has been deleted.`);
    } else {
      res.status(404).send("Document not found.");
    }
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
});

module.exports = router;
