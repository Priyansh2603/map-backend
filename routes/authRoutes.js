const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../authMiddleware");
const User = require("../models/User");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("fields")
      .select("-__v");

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


module.exports = router;
