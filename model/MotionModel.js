const mongoose = require('mongoose');
const motionSchema = new mongoose.Schema({
    detection:{
        required: true,
        type: Boolean,
    }
});

module.exports=mongoose.model('MotionModel', motionSchema);