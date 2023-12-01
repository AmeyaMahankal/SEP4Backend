const express = require('express');
const PinCodeModel = require('../model/PinCodeModel');

const router = express.Router();

// GET method to retrieve matching pin code
router.get('/getPin', async (req, res) => {
  try {
    const enteredPin = req.body.pinCode;

    if (!enteredPin) {
      return res.status(400).json({ error: 'Please provide a pin code.' });
    }

    const matchingPin = await PinCodeModel.findOne({ pinCode: enteredPin });
    if (!matchingPin) {
      return res.status(404).json({ error: 'No matching pin code found.' });
    }

    res.json(matchingPin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST method to compare entered pin code
router.post('/comparePin', async (req, res) => {
  try {
    const enteredPin = req.body.pinCode;

    if (!enteredPin) {
      return res.status(400).json({ error: 'Please provide a pin code.' });
    }

    // Retrieve the stored pin code from the database
    const storedPin = await PinCodeModel.findOne({});

    if (!storedPin) {
      return res.status(404).json({ error: 'No pin code found in the database.' });
    }

    // Compare the entered pin code with the stored pin code
    const isMatch = enteredPin === storedPin.pinCode;

    if (isMatch) {
      res.json({ message: 'Pin codes match!' });
    } else {
      res.status(401).json({ error: 'Pin codes do not match.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
