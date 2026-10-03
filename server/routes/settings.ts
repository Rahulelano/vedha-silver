import express from "express";
import Setting from "../models/Setting.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/:key", async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      res.json(setting.value);
    } else {
      res.status(404).json({ message: "Setting not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/:key", async (req, res) => {
  try {
    const { value } = req.body;
    let setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Setting({ key: req.params.key, value });
      await setting.save();
    }
    res.json(setting.value);
  } catch (error: any) {
    console.error("Settings POST Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

export default router;
