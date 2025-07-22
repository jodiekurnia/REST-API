const mongoose = require('mongoose');

const gmailAccountSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: {
    month: { type: String },
    date: { type: String },
    year: { type: String },
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