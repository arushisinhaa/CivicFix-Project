const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const auth = require("../middleware/auth");

router.use(auth(true));

router.get("/issues", async (req, res) => {
  try {
    console.log(req);
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .populate("reportedBy", "email")
      .sort({ createdAt: -1 });

    if (issues.length === 0) {
      return res
        .status(404)
        .json({ message: "No issues found with these filters" });
    }

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "email")
      .populate("updates.changedBy", "email")
      .populate("adminComments.postedBy", "email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "email")
      .populate("updates.changedBy", "email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/issues/:id", async (req, res) => {
  try {
    const { status, comment } = req.body;
    const user = req.user;

    const update = {
      status,
      $push: {
        updates: {
          status,
          comment: comment || "",
          changedAt: new Date(),
          changedBy: user._id,
        },
      },
    };

    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate("reportedBy", "email")
      .populate("updates.changedBy", "email")
      .populate("adminComments.postedBy", "email");

    res.json(updatedIssue);
  } catch (err) {
    console.error("Error in /issues/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/issues/:id/comments", async (req, res) => {
  try {
    const { comment } = req.body;
    const user = req.user;

    const newComment = {
      content: comment,
      postedBy: user._id,
      createdAt: new Date(),
    };

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $push: { adminComments: newComment } },
      { new: true }
    ).populate("adminComments.postedBy", "email");

    const lastComment = updatedIssue.adminComments.slice(-1)[0];
    res.json(lastComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
