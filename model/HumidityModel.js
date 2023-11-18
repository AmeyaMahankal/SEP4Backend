const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    
    measurment: {
        required: true,
        type: Number
    }
    ,
    time: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('humidity', dataSchema)