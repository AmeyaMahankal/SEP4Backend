// routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const PinModel = require('../model/PinModel');

const router = express.Router();
const secretKey = 'your-secret-key'; // Replace with a strong, unique secret key

// Endpoint for user login with PIN
router.post('/login', async (req, res) => {
  const { pin } = req.body;

  try {
    // Mock PIN verification (replace with actual PIN validation logic)
    const foundPin = await PinModel.findOne({ pin });

    if (foundPin) {
      const token = jwt.sign({ pin: foundPin.pin }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid PIN' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example protected endpoint that requires a valid JWT
router.get('/protected', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Token is valid
    res.json({ message: 'Protected resource', pin: decoded.pin });
  });
});

module.exports = router;
