const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobApplication = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fullname: { type: String, required: true },
    contact: { type: String, required: true },
    education: { type: String, required: true },
    course: { type: String, required: true },
    speacilization: { type: String, required: true },
    universityName: { type: String, required: true },
    passOutYear: { type: String, required: true },
    resume: { type: String, required: true },
    accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("jobApplication", jobApplication);
