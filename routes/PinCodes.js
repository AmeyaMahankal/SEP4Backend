const express = require('express');
const router = express.Router();
const PincodeService = require('../services/PincodeService');

router.post('/comparePin', async (req, res) => {
    try {
        const result = await PincodeService.comparePin(req.body.pinCode);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/update-pin', async (req, res) => {
    try {
        const result = await PincodeService.updatePin(req.body.pinCode);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
