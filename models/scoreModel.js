const mongoose = require("mongoose");
const scoreSchema = mongoose.Schema(
  {
    score: { type: Number, required: true, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // email: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Score", scoreSchema);
