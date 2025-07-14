const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["reported", "under_review", "in_progress", "resolved", "rejected"],
    },
    comment: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    content: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const IssueSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  status: {
    type: String,
    default: "reported",
    enum: ["reported", "under_review", "in_progress", "resolved", "rejected"],
  },
  adminComment: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updates: [updateSchema],
  adminComments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", IssueSchema);
