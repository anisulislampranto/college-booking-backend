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
    students: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
      ,
    ],
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gallery" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
