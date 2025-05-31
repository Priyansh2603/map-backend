const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { phone } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const user = new User(req.body);
    await user.save();

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.log(err)

    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Login failed" });
  }
};
