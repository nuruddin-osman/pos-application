const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    address: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosisDate: Date,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

const Patients = mongoose.model("PatientAppointment", patientSchema);

module.exports = Patients;
