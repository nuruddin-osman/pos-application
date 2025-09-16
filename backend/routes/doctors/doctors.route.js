// routes/doctor.route.js
const express = require("express");
const Doctor = require("../../models/doctors/doctors.model");
const router = express.Router();

/**
 * ১. সমস্ত ডাক্তারদের তালিকা
 */
router.get("/", async (req, res) => {
  try {
    const { search, specialization } = req.query;

    let query = {};

    // সার্চ
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ];
    }

    // বিশেষত্ব ফিল্টার
    if (specialization && specialization !== "all") {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query);

    res.json({
      doctors,
      message: "ডাক্তারদের তালিকা সফলভাবে লোড করা হয়েছে",
    });
  } catch (error) {
    res.status(500).json({ error: "সার্ভার এরর", details: error.message });
  }
});

/**
 * ২. নির্দিষ্ট ডাক্তার এর তথ্য
 */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "ডাক্তার খুঁজে পাওয়া যায়নি" });
    }
    res.json({ doctor, message: "ডাক্তারের তথ্য সফলভাবে লোড করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ error: "সার্ভার এরর", details: error.message });
  }
});

/**
 * ৩. নতুন ডাক্তার যোগ
 */
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({
      message: "ডাক্তার সফলভাবে যোগ করা হয়েছে",
      doctor,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "ডাটা ভ্যালিডেশন ব্যর্থ হয়েছে", details: error.message });
  }
});

/**
 * ৪. ডাক্তার তথ্য আপডেট
 */
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ error: "ডাক্তার খুঁজে পাওয়া যায়নি" });
    }

    res.json({
      message: "ডাক্তারের তথ্য সফলভাবে আপডেট করা হয়েছে",
      doctor,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "আপডেট ব্যর্থ হয়েছে", details: error.message });
  }
});

/**
 * ৫. ডাক্তার ডিলিট
 */
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: "ডাক্তার খুঁজে পাওয়া যায়নি" });
    }

    res.json({
      message: "ডাক্তার সফলভাবে ডিলিট করা হয়েছে",
      doctor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "ডিলিট ব্যর্থ হয়েছে", details: error.message });
  }
});

/**
 * ৬. শুধুমাত্র বিশেষত্ব এর তালিকা
 */
router.get("/specializations/list/all", async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    res.json({
      specializations,
      message: "বিশেষত্বের তালিকা সফলভাবে লোড করা হয়েছে",
    });
  } catch (error) {
    res.status(500).json({ error: "সার্ভার এরর", details: error.message });
  }
});

module.exports = router;
