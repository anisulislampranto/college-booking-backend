const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["approved", "pending", "deleted"],
      required: true,
      default: "pending",
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    admissionDate: { type: String },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    researches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Research" }],
    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    students: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["approved", "admissionPending", "rejected"],
          required: true,
          default: "admissionPending",
        },
        paymentStatus: {
          status: {
            type: String,
            enum: ["paid", "pending"],
            required: true,
            default: "pending",
          },
          transactionId: {
            type: String,
          },
        },
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
