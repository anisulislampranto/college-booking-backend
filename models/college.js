const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    admissionDate: { type: String, required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events" }],
    researches: { type: String },
    sports: { type: String },
    rating: { type: Number, default: 0 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);