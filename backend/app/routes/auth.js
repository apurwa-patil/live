import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/universalEmailService.js";

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      age, 
      gender,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    await newUser.save();

    // Send verification email
    try {
      console.log('📧 Starting universal email verification...');
      const result = await sendVerificationEmail(email, verificationToken);
      
      if (result.success) {
        if (result.provider) {
          console.log(`✅ Email sent via ${result.provider}`);
        } else if (result.consoleFallback) {
          console.log('📋 Verification link shown in console (fallback)');
        }
      }
    } catch (emailError) {
      console.error('❌ Email system failed:', emailError);
      console.log('⚠️ User registered but verification may not work');
    }

    res.status(201).json({ 
      message: "User registered successfully. Please check your email for verification.",
      requiresVerification: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in.",
        requiresVerification: true
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Email verification route
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.json({ message: "Verification email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password route
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
