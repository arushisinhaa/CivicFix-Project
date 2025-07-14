const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const User = require("../models/User");

router.get("/myissues", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const issues = await Issue.find({ reportedBy: user._id })
      .sort({ createdAt: -1 })
      .select("title status createdAt category");

    res.json(issues);
  } catch (err) {
    console.error("Get user issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "reportedBy",
      "email name"
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const response = {
      ...issue._doc,
      currentStatus: issue.status,
      statusHistory: [
        {
          status: issue.status,
          changedAt: issue.updatedAt || issue.createdAt,
          comment: issue.adminComment || "",
        },
      ],
    };

    res.json(response);
  } catch (err) {
    console.error("Get issue error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const validStatuses = [
      "reported",
      "under_review",
      "in_progress",
      "resolved",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, adminComment, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedIssue)
      return res.status(404).json({ message: "Issue not found" });

    const response = {
      ...updatedIssue._doc,
      currentStatus: updatedIssue.status,
      statusHistory: [
        {
          status: updatedIssue.status,
          changedAt: updatedIssue.updatedAt,
          comment: updatedIssue.adminComment || "",
        },
      ],
    };

    res.json(response);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
