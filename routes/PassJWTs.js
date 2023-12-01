// routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const PassModel = require('../model/PassModel');

const router = express.Router();
const secretKey = 'your-secret-key'; // Replace with a strong, unique secret key

// Endpoint for user login with password
router.post('/login', async (req, res) => {
  const { password } = req.body; // Change from pin to password

  try {
    // Mock password verification (replace with actual password validation logic)
    const foundPassword = await PassModel.findOne({ password });

    if (foundPassword) {
      const token = jwt.sign({ password: foundPassword.password }, secretKey, { expiresIn: '1h' });

      // Automatically call the protected route using the generated token
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Token is valid
        res.json({ message: 'Login successful', token, protectedData: { password: decoded.password } });
      });
    } else {
      res.status(401).json({ error: 'Invalid Password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.patch('/update-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Verify the old password first
    const foundPassword = await PassModel.findOne({ password: oldPassword });

    if (!foundPassword) {
      return res.status(401).json({ error: 'Invalid Old Password' });
    }

    // Update the password
    foundPassword.password = newPassword;
    await foundPassword.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





module.exports = router;
