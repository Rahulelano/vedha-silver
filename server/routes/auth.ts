import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // First user is admin (Optional logic, let's just keep standard creation)
    const count = await User.countDocuments();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: count === 0,
    });

    if (user) {
      // Send Welcome Email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Welcome to Vedhav Silvers, ${user.name}! ✨`,
        text: `Dear ${user.name},

Thank you for creating an account with Vedhav Silvers! 
Your account has been successfully set up. You can now track your orders, manage your delivery addresses, and quickly bag your favorite silver jewellery.

If you have any questions, feel free to reply to this email!

With love,
Vedhav Silvers Atelier
No. 42, North Mada Street, Mylapore, Chennai`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error("Welcome email error:", err);
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" }),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" }),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.city = req.body.city !== undefined ? req.body.city : user.city;
      user.zip = req.body.zip !== undefined ? req.body.zip : user.zip;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        city: updatedUser.city,
        zip: updatedUser.zip,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
