// model.js
const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  pin: {
    type: Number,
    required: true,
  },
});

const PinModel = mongoose.model('Pin', pinSchema);

module.exports = PinModel;
