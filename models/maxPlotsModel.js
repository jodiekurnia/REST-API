const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  maxPlots: {
    required: true,
    type: Number,
  },
});

module.exports = mongoose.model('maxPlots', dataSchema);
