const mongoose = require("mongoose");

// Define the Price schema and model
const priceSchema = new mongoose.Schema({
  price: Number,
  url: String,
});

module.exports = mongoose.model("price", priceSchema);
