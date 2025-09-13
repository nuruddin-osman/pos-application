const express = require("express");
const router = express.Router();

const auth = require("../../middleware/admin/auth");
const {
  getAdminProfile,
  updateAdminProfile,
  apdateAdminProfilePic,
  passwordChanpge,
  getActivityLog,
  getLoginHistory,
  patchTowFactor,
  patchNotification,
  getAllAdmin,
  createAdmin,
} = require("../../controllers/adminController/adminController");

// get admin profile
router.get("/profile", auth, getAdminProfile);

// admin profile update
router.put("/profile", auth, updateAdminProfile);

// Profile pic update
router.patch("/profile/image", auth, apdateAdminProfilePic);

// password change
router.patch("/password", auth, passwordChanpge);

// get  ActivityLog
router.get("/activity-logs", auth, getActivityLog);

// get login history
router.get("/login-history", auth, getLoginHistory);

// Tow factors authentication active or inactive set
router.patch("/two-factor", auth, patchTowFactor);

// Notification setting aupdate
router.patch("/notifications", auth, patchNotification);

// get all admin (for super admin)
router.get("/", auth, getAllAdmin);

// new admin create (for super admin)
router.post("/", auth, createAdmin);

module.exports = router;
