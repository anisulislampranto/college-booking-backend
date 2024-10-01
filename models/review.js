const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
