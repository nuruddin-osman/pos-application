const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admin.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "অনুমতি denied, টোকেন নেই" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "টোকেন বৈধ নয়" });
    }

    if (!admin.isActive) {
      return res
        .status(401)
        .json({ message: "অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে" });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "টোকেন বৈধ নয়" });
  }
};

module.exports = auth;
