const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "consultation",
        "pharmacy",
        "lab_test",
        "procedure",
        "salary",
        "medication_purchase",
        "equipment",
        "utility",
        "other",
      ],
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    reference: String, // Invoice ID or other reference
    createdBy: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
