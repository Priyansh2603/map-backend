const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  state: String,
  district: String,
  tehsil: String,
  village: String,
  language: String,
  phone: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
