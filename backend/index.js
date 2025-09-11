const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Patient Management API কাজ করছে!" });
});

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is runing at http://localhost:${PORT}`);
});
