const Field = require("../models/Field");
const User = require("../models/User");

exports.addField = async (req, res) => {
  try {
    const {  cropType, sowingDate, pumpType, dischargeCapacity,coordinates } = req.body;
    const userId = req.user.id;

    const field = new Field({ user: userId, cropType, sowingDate, pumpType, dischargeCapacity,coordinates });
    await field.save();
console.log(userId)
    // Update user with the new field reference
    await User.findByIdAndUpdate(userId, { $push: { fields: field._id } });

    res.status(201).json({ message: "Field added successfully", field });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
