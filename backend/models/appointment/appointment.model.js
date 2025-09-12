const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 30 }, // minutes
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "noshow"],
      default: "scheduled",
    },
    notes: String,
    createdBy: String,
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
