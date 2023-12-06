const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  pinCode: {
    type: Number,  // Assuming PIN code is a number
    required: true,
  },
});

const PinCodeModel = mongoose.model('Pin', pinSchema);

module.exports = PinCodeModel;
