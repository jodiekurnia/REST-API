const mongoose = require('mongoose');

const pfWLSchema = new mongoose.Schema({
  userId: {
    type: [Number], // Assuming Telegram user IDs are strings
    required: true,
    unique: true, // Optionally, ensure uniqueness of user IDs
    // Add more validation if needed, e.g., minlength: 1
  },
});

module.exports = mongoose.model('PumpFun', pfWLSchema);
