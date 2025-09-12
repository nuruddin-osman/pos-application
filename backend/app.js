const express = require("express");
const cors = require("cors");
const patientManagementRouter = require("./routes/patient-management/patient_management.route");
const billingInvoiceRouter = require("./routes/billingAndInvoice/billingAndInvoice.route");
require("dotenv").config();
require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Patient Management API কাজ করছে!" });
});

app.use("/api/patients", patientManagementRouter);
app.use("/api/billing-invoice", billingInvoiceRouter);

//routes error handller
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    url: req.originalUrl,
  });
});

//server error handller
app.use((err, req, res, next) => {
  console.error(err.stack); // console error log
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
