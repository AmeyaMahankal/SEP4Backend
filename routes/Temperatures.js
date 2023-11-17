const express = require('express');

const router = express.Router()

router.post('/post', (req, res) => {
    res.send('Post API')
})

//Get all Method
router.get('/getTemperatures', (req, res) => {
    res.send('Get All API')
})

module.exports = router;