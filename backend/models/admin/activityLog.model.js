const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: [
        "patient",
        "billing",
        "inventory",
        "appointment",
        "reporting",
        "system",
      ],
      required: true,
    },
    details: String,
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
