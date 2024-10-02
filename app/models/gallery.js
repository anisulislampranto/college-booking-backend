const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
