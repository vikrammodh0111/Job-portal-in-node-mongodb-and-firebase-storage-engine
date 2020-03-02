const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    isCandidate: { type: Boolean, default: false },
    isRecruiter: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", User);
