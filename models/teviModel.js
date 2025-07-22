const mongoose = require('mongoose');

const gmailAccountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: {
    month: { type: String, required: true },
    date: { type: String, required: true },
    year: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const clonerSchema = new mongoose.Schema({
  clonerNumber: { type: Number, required: true }, // 1-50
  gmails: [gmailAccountSchema], // max 10
});

const teviSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  cloners: [clonerSchema], // max 50
});

module.exports = mongoose.model('Tevi', teviSchema); 