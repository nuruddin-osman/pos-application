const express = require("express");
const Doctors = require("../../models/appointment/doctor.model");
const router = express.Router();

// সব ডাক্তার পাওয়ার জন্য
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctors.find({ isActive: true });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
