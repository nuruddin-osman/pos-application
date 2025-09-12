const express = require("express");
const PaientsManagement = require("../../models/patient-management/patient_management.model");
const {
  PaientsManagementSearchQuery,
  createPaientsManagement,
  getSinglePaientsManagement,
  updatePaientsManagement,
  deletePaientsManagement,
} = require("../../controllers/patientManagementController/patientManagementController");
const router = express.Router();

// All patients api
router.get("/", PaientsManagementSearchQuery);

// single patients API
router.get("/:id", getSinglePaientsManagement);

// new patients API
router.post("/", createPaientsManagement);

// patients update API
router.put("/:id", updatePaientsManagement);

// Paients delete API
router.delete("/:id", deletePaientsManagement);

module.exports = router;
