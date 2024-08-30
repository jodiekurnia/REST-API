const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  email: { required: true, type: String },
  password: { required: true, type: String },
  status: { type: String, default: "fresh" },
});

module.exports = mongoose.model("jodie", dataSchema);
