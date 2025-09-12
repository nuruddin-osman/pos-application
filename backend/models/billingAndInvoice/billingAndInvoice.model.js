const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    services: [serviceSchema],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bkash", "bank"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
