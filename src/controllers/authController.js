const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const sendEmail = require("../utils/email");

// ===============================
// Generate JWT
// ===============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ===============================
// SIGNUP
// ===============================
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // ===============================
// // FORGOT PASSWORD
// // ===============================
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // 1️⃣ Find the user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2️⃣ Generate reset token
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

//     await user.save();

//     // 3️⃣ Create reset URL using FRONTEND_URL
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     // 4️⃣ Email content
//     const message = `
//       <h2>Password Reset Request</h2>
//       <p>Hello,</p>
//       <p>We received a request to reset your password. Click the link below to reset it:</p>
//       <a href="${resetUrl}" target="_blank">Reset Password</a>
//       <p>This link will expire in 15 minutes.</p>
//       <p>If you did not request this, you can ignore this email.</p>
//     `;

//     // 5️⃣ Send email
//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset Request",
//       html: message,
//     });

//     res.status(200).json({
//       message: "Reset password link has been sent to your email",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error.message);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
