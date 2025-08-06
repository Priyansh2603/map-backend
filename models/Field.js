const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ndmi: { type: mongoose.Schema.Types.Mixed, default:null},
    weather: { type: mongoose.Schema.Types.Mixed, default:null},
    cropType: String,
    cropName: String,
    sowingDate: Date,
    pumpType: String,
    dischargeCapacity: Number, // in Liters per Minute
    pumpNumber: String, // in Liters per Minute

    // Add this to store [[[lng, lat], ...]] style coordinates
    coordinates: {
      type: [[[Number]]], // array of array of array of numbers
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
