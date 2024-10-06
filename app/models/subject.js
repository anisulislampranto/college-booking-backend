const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
