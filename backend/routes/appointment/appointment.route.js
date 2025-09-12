const express = require("express");
const router = express.Router();

const {
  getAllAppointment,
  getSingleAppointment,
  createAppointment,
  updateAppointment,
  appointmentStatusUpdate,
  deleteAppointment,
  getDoctorsAvility,
  upcomingAppointment,
} = require("../../controllers/appointmentController/appointmentController");

// get all appointment
router.get("/", getAllAppointment);

// get single appointment
router.get("/:id", getSingleAppointment);

// create appointment
router.post("/", createAppointment);

// appointment update
router.put("/:id", updateAppointment);

// appointment status update
router.patch("/:id/status", appointmentStatusUpdate);

// appointment delete
router.delete("/:id", deleteAppointment);

// Doctors  available slot check
router.get("/doctors/:id/availability", getDoctorsAvility);

// upcoming  appointment
router.get("/upcoming/appointments", upcomingAppointment);

module.exports = router;
