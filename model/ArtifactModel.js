const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    imageUrl: {
        required: true,
        type: String
    },
    minTemp: {
        required: true,
        type: Number
    },
    maxTemp: {
        required: true,
        type: Number
    },
    maxLight: {
        required: true,
        type: Number
    },
    minHumidity: {
        required: true,
        type: Number
    },
    maxHumidity: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('artefact', dataSchema);