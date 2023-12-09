const express = require('express');
const TemperatureService = require('../services/TemperatureService');
const HumidityService = require('../services/HumidityService');
const LightService = require('../services/LightLevelService');
const artifactService = require("../services/ArtifactService");//check service name


const router = express.Router();

router.get('/getWarnings', async (req, res) => {
    try {
        const artifacts = await artifactService.getAllArtifacts(); //check method name
        const hum = (await HumidityService.getAllHumidities())[0].measurment;
        const temp = (await TemperatureService.getAllTemperatures())[0].temperature;
        const light = (await LightService.getAllLightLevels())[0].lightLevel;

        const warningObjects = [];

        artifacts.forEach(artefact => {
            let artefactWarning = "";
            let name = artefact.name;
            if (temp > artefact.maxTemp) {
                artefactWarning += "Temperature is too high!";
            }
            else if (temp < artefact.minTemp) {
                artefactWarning += " Temperature is too low!";
            }

            if (hum > artefact.maxHumidity) {
                artefactWarning += " Humidity is too high!";
            }
            else if (hum < artefact.minHumidity) {
                artefactWarning += " Humidity is too low!";
            }
            if (light > artefact.maxLight) {
                artefactWarning += " Light levels is too high!";
            }

            warningObjects.push({
                artefactId: artefact.id,
                artefactName: name,
                warning: artefactWarning
            })
        });

        res.json(warningObjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;