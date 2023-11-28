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

      // Automatically call the protected route using the generated token
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Token is valid
        res.json({ message: 'Login successful', token, protectedData: { pin: decoded.pin } });
      });
    } else {
      res.status(401).json({ error: 'Invalid PIN' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
