const ActivityLog = require("../../models/admin/activityLog.model");
const Admin = require("../../models/admin/admin.model");

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "অ্যাডমিন পাওয়া যায়নি" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, emergencyContact, bio } =
      req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
        dateOfBirth,
        emergencyContact,
        bio,
      },
      { new: true, runValidators: true }
    ).select("-password");

    // ActivityLog add
    await ActivityLog.create({
      adminId: req.user.id,
      action: "প্রোফাইল আপডেট করেছেন",
      module: "system",
      details: "ব্যক্তিগত তথ্য আপডেট করা হয়েছে",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const apdateAdminProfilePic = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password");

    // ActivityLog log add
    await ActivityLog.create({
      adminId: req.user.id,
      action: "প্রোফাইল ছবি আপডেট করেছেন",
      module: "system",
      details: "প্রোফাইল ছবি পরিবর্তন করা হয়েছে",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const passwordChanpge = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    // current password check
    if (!(await admin.correctPassword(currentPassword, admin.password))) {
      return res.status(401).json({ message: "বর্তমান পাসওয়ার্ড ভুল" });
    }

    // new password set
    admin.password = newPassword;
    await admin.save();

    // ActivityLog add
    await ActivityLog.create({
      adminId: req.user.id,
      action: "পাসওয়ার্ড পরিবর্তন করেছেন",
      module: "system",
      details: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const logs = await ActivityLog.find({ adminId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments({ adminId: req.user.id });

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("loginHistory");

    res.json(admin.loginHistory.slice(0, 10)); // শেষের ১০টি লগইন
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const patchTowFactor = async (req, res) => {
  try {
    const { enabled } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { twoFactorEnabled: enabled },
      { new: true }
    ).select("-password");

    // Activity log add
    await ActivityLog.create({
      adminId: req.user.id,
      action: `২-ফ্যাক্টর অথেন্টিকেশন ${enabled ? "সক্ষম" : "অক্ষম"} করেছেন`,
      module: "system",
      details: `২-ফ্যাক্টর অথেন্টিকেশন ${
        enabled ? "সক্ষম" : "অক্ষম"
      } করা হয়েছে`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const patchNotification = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, pushNotifications } =
      req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      {
        "notifications.email": emailNotifications,
        "notifications.sms": smsNotifications,
        "notifications.push": pushNotifications,
      },
      { new: true }
    ).select("-password");

    // Activity log add
    await ActivityLog.create({
      adminId: req.user.id,
      action: "নোটিফিকেশন সেটিংস আপডেট করেছেন",
      module: "system",
      details: "নোটিফিকেশন পছন্দসমূহ আপডেট করা হয়েছে",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    // only access super admin
    const admin = await Admin.findById(req.user.id);
    if (admin.role !== "super_admin") {
      return res.status(403).json({ message: "অনুমতি denied" });
    }

    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    // Access only super admin
    const admin = await Admin.findById(req.user.id);
    if (admin.role !== "super_admin") {
      return res.status(403).json({ message: "অনুমতি denied" });
    }

    const newAdmin = new Admin(req.body);
    await newAdmin.save();

    // reponse without password
    const adminWithoutPassword = await Admin.findById(newAdmin._id).select(
      "-password"
    );

    res.status(201).json(adminWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
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
};
