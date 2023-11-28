const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    distance: {
        required: true,
        type: Number
    }
    ,
    angle: {
       required: true,
       type: Number,
    
    validate: {
        validator: function(value) {
            return value >= 15 && value <= 65;
        },
    
    }

}})
module.exports=mongoose.model('AngleAndDistance', dataSchema);