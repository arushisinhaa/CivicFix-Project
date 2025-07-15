const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Issue = require("../models/Issue");
const User = require("../models/User");

router.post("/report", upload.single("image"), async (req, res) => {
  try {
    const { title, category, description, lat, lng, address, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const newIssue = new Issue({
      title,
      category,
      description,
      imageUrl: req.file ? req.file.path : "",
      location: {
        lat: Number(lat),
        lng: Number(lng),
        address,
      },
      reportedBy: user._id,
    });

    await newIssue.save();
    res.status(201).json({ message: "Issue reported successfully" });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/myissues", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const issues = await Issue.find({ reportedBy: user._id });
    res.json(issues);
  } catch (err) {
    console.error("Fetch issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
