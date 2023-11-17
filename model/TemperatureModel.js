const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    temperature: {
        required: true,
        type: Number
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('temperature', dataSchema)