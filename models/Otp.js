const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  reqId: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 mins
});

module.exports = mongoose.model("Otp", otpSchema);
