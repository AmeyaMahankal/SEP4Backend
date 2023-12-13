const express = require('express');
const PassService = require('../services/PassService');

const router = express.Router();
const secretKey = 'your-secret-key'; // Replace with a strong, unique secret key
const passService = new PassService(secretKey);

router.post('/login', async (req, res) => {
    const { password } = req.body;

    try {
        const result = await passService.login(password);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/update-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
       
        const result = await passService.updatePassword(oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
