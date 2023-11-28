const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  password: {
    type: String,  // Assuming password is a string
    required: true,
  },
});

const PassModel = mongoose.model('Pass', passSchema);

module.exports = PassModel;
