const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "ডাক্তারের নাম প্রয়োজন"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "বিশেষত্ব প্রয়োজন"],
      enum: [
        "কার্ডিওলজিস্ট",
        "নিউরোলজিস্ট",
        "অর্থোপেডিক সার্জন",
        "গাইনোকোলজিস্ট",
        "পেডিয়াট্রিশিয়ান",
        "ডার্মাটোলজিস্ট",
        "গ্যাস্ট্রোএন্টেরোলজিস্ট",
        "ইএনটি স্পেশালিস্ট",
        "আই স্পেশালিস্ট",
        "সাইকিয়াট্রিস্ট",
      ],
    },
    phone: {
      type: String,
      required: [true, "ফোন নম্বর প্রয়োজন"],
    },
    email: {
      type: String,
      required: [true, "ইমেইল প্রয়োজন"],
      unique: true,
      lowercase: true,
    },
    qualification: {
      type: String,
      required: [true, "Qualification প্রয়োজন"],
    },
    experience: {
      type: String,
    },
    consultationFee: {
      type: Number,
      required: [true, "কন্সালটেশন ফি প্রয়োজন"],
      min: [0, "ফি শূন্যের বেশি হতে হবে"],
    },
    availability: {
      type: String,
      enum: ["available", "busy", "on_leave"],
      default: "available",
    },
    bio: {
      type: String,
      maxlength: [500, "বায়ো ৫০০ অক্ষরের মধ্যে হতে হবে"],
    },
    address: {
      type: String,
      required: [true, "ঠিকানা প্রয়োজন"],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: [0, "রেটিং ০-৫ এর মধ্যে হতে হবে"],
      max: [5, "রেটিং ০-৫ এর মধ্যে হতে হবে"],
      default: 4.5,
    },
    image: {
      type: String,
      default: "default-doctor.jpg",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
