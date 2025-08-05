const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "31d",
  });
};
exports.signup = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: "Mobile number already registered." });
    }

    const user = new User(req.body);
    await user.save();

    const token = generateToken(user);
    return res.status(201).json({
      success: true,
      message: "Signup successful.",
      token,
      user
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ success: false, message: "Signup failed. Please try again later." });
  }
};


exports.login = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "Mobile number not registered yet." });
    }

    const token = generateToken(user);
    console.log({
      success: true,
      message: "Login successful.",
      token,
      user
    })
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Login failed. Please try again later." });
  }
};

// async function login (req, res)  {
//   try {
//     const { phone } = {phone : "8791152142"};

//     if (!phone) {
//       console.log({ success: false, message: "Phone number is required." });
//     }

//     const user = await User.findOne({ phone });
//     if (!user) {
//       console.log({ success: false, message: "Mobile number not registered yet." });
//     }

//     const token = generateToken(user);
//     console.log({
//       success: true,
//       message: "Login successful.",
//       token,
//       user
//     })
//     // return res.status(200).json({
//     //   success: true,
//     //   message: "Login successful.",
//     //   token,
//     //   user
//     // });
//   } catch (err) {
//     console.error("Login Error:", err);
//     // return res.status(500).json({ success: false, message: "Login failed. Please try again later." });
//   }
// };
// login();
