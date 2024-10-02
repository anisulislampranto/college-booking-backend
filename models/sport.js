const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sport", sportSchema);
