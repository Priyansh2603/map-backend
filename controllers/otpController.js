const axios = require("axios");
const Otp = require("../models/Otp");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "31d",
  });
};
const generateReqId = () => {
    return crypto.randomBytes(12).toString("hex"); // 24 characters
};
exports.sendOtp = async (req, res) => {
    const { phone } = req.body;

    if (!phone || phone.length !== 10)
        return res.status(400).json({ success: false, message: "Invalid phone number" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const apiUrl = `https://api.authkey.io/request?authkey=${process.env.AUTHKEY}&mobile=${phone}&country_code=91&sid=24634&name=User&otp=${otp}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const req_id = generateReqId();
        if (data?.Message === 'Submitted Successfully') {
            // Save OTP to DB
            await Otp.create({
                phone,
                otp,
                reqId: req_id
            });

            return res.json({
                success: true,
                message: "OTP sent successfully",
                reqId: req_id
            });
        } else {
            console.error(data.message)
            return res.status(500).json({
                success: false,
                message: data.message || "Failed to send OTP"
            });
        }
    } catch (error) {
        console.error("SEND OTP ERROR:", error.message);
        return res.status(500).json({ success: false, message: "OTP send failed" });
    }
};
// const User = require("../models/User"); // if you have a user model

exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp)
        return res.status(400).json({ success: false, message: "Missing phone or otp" });

    try {
        const existingOtp = await Otp.findOne({ phone, otp });

        if (!existingOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Optional: delete after verification
        await Otp.deleteMany({ phone });
        const user = await User.findOne({phone})
        const token = generateToken(user)
        // TODO: find or create user
        if (!phone ) {
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }
        if (!user ) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }


        return res.json({
            success: true,
            message: "Login successful",
            user,
            token
        });
    } catch (error) {
        console.error("VERIFY OTP ERROR:", error.message);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};
