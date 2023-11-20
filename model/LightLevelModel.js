const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    lightLevel: {
        required: true,
        type: Number
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('lightLevel', dataSchema)