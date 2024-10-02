const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
