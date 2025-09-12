const express = require("express");
const router = express.Router();

const {
  reportGenerate,
  getReport,
  getSingleReport,
  getDashBoardSummary,
  getChart,
} = require("../../controllers/reportingController/reportingController");

//Report generate API
router.post("/generate", reportGenerate);

// get report api
router.get("/", getReport);

// get single report api
router.get("/:id", getSingleReport);

// get dashboard summary
router.get("/dashboard/summary", getDashBoardSummary);

// get chart data
router.get("/charts/:type", getChart);

module.exports = router;
