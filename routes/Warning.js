const express = require('express');
const TemperatureService = require('../model/TemperatureService');
const HumidityService = require('../model/HumidityService');
const LightService = require('../model/LightService');
const artifactService = require("../services/ArtifactService");//check service name

const router = express.Router();

router.get('/getWarnings', async (req, res) => {
    try {
        const artifacts = artifactService.getAllArtifacts(); //check method name
        const hum = HumidityService.getAllHumidities()[0];
        const temp = TemperatureService.getAllTemperatures()[0];
        const light = LightService.getAllLightLevels()[0];
        const warnings = [];

        artifacts.forEach(artefact => {
            let name = artefact.name;
            if (temp > artefact.maxTemp) {
                warning.push("Artefact " + name + ": Temperature is too high!");
            } 
            else if (temp < artefact.minTemp) {
                warning.push("Artefact " + name + ": Temperature is too low!");
            } 
            else if (hum > artefact.maxHumidity) {
                warning.push("Artefact " + name + ": Humidity is too high!");
            }
            else if (hum < artefact.minHumidity) {
                warning.push("Artefact " + name + ": Humidity is too low!");
            }
            else if (light > artefact.maxLight) {
                warning.push("Artefact " + name + ": Light levels too high!");
            }
        });
        const warning="";
        warnings.forEach(war => {
            warning += war + " ";
        });

        res.json(warning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;