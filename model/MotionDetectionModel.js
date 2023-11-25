const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    warning: {
        required: true,
        type: String
    }
    ,
    time: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('motiondetect', dataSchema)