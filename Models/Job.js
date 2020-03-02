const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    numberOfAvaliableVacancy: { type: String, required: true },
    salaryStart: { type: String, required: true },
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    jobType: { type: String, default: "full time" },
    skill: { type: String, required: true },
    jobLocation: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    minimumExperience: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("job", jobSchema);
