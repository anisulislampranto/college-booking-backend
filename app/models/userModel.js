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
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    type: {
      type: String,
      enum: ["student", "admin", "collegeAdmin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
