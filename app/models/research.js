const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // image: { type: String, required: true },
    description: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", researchSchema);
