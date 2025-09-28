const express = require("express");
const cors = require("cors");
const passport = require("passport");
const patientManagementRouter = require("./routes/patient-management/patient_management.route");
const billingInvoiceRouter = require("./routes/billingAndInvoice/billingAndInvoice.route");
const inventortyRouter = require("./routes/inventory/inventory.route");
const appointmentRouter = require("./routes/appointment/appointment.route");
// const doctorsRouter = require("./routes/appointment/doctors.route");
// const patientAppointmentRouter = require("./routes/appointment/patients.route");
const reportRouter = require("./routes/reporting/reporting.route");
const adminRouter = require("./routes/admin/admin.route");
const doctrosRouter = require("./routes/doctors/doctors.route");
const authRoute = require("./routes/auth/auth.routes");
require("dotenv").config();
require("./config/database");
require("./config/passport");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Patient Management API কাজ করছে!" });
});

app.use("/api/patients", patientManagementRouter);
app.use("/api/billing-invoice", billingInvoiceRouter);
app.use("/api/inventory", inventortyRouter);
app.use("/api/appointments", appointmentRouter);
// app.use("/api/doctors", doctorsRouter);
// app.use("/api/patients-appointment", patientAppointmentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctors", doctrosRouter);
app.use("/api", authRoute);

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
