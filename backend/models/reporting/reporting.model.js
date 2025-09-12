const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["financial", "patient", "inventory", "service", "staff"],
    },
    subType: { type: String }, // income, expense, registration, etc.
    period: { type: String, required: true }, // daily, weekly, monthly, yearly
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // Report data in flexible format
    generatedBy: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
