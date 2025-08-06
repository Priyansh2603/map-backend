const Field = require("../models/Field");
const User = require("../models/User");

exports.addField = async (req, res) => {
  try {
    const {  cropType, sowingDate, pumpType,cropName, dischargeCapacity,coordinates, pumpNumber } = req.body;
    const userId = req.user.id;

    const field = new Field({ user: userId, cropType, sowingDate, cropName, pumpType, dischargeCapacity,coordinates, pumpNumber });
    await field.save();
console.log(userId)
    // Update user with the new field reference
    await User.findByIdAndUpdate(userId, { $push: { fields: field._id } });

    res.status(201).json({ message: "Field added successfully", field });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveField = async (req, res) => {
  try {
    const userId = req.user.id; // fixed destructuring
    const { id } = req.params;
console.log(req.body)
    const updatedField = await Field.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document
      runValidators: true, // ensure validation rules are enforced
    });

    if (!updatedField) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.status(200).json({ message: "Field updated successfully", field: updatedField });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};