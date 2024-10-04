const mongoose = require("mongoose");
const todoSchema = mongoose.Schema(
  {
    task: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // email: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Todo", todoSchema);