const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriber = new Schema(
  {
    email: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("subscriberlist", subscriber);
