const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageLink: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    colleges: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        college: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "College",
          required: true,
        },
      },
    ],
    type: {
      type: String,
      enum: ["student", "admin", "collegeAdmin"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
