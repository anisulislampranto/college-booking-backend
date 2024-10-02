const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    admissionDate: { type: String },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    researches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Research" }],
    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
