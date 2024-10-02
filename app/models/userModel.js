const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
