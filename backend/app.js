const express = require("express");
const cors = require("cors");
const router = require("./routes/patient-management/patient_management.route");
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

app.use("/api/patients", router);

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
  console.error(err.stack); // console এ error log হবে
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
