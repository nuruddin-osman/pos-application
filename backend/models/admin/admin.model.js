const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    dateOfBirth: Date,
    emergencyContact: String,
    bio: String,
    profileImage: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator"],
      default: "admin",
    },
    permissions: {
      patientManagement: { type: Boolean, default: true },
      billing: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      reporting: { type: Boolean, default: true },
      systemSettings: { type: Boolean, default: false },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    loginHistory: [
      {
        date: Date,
        ipAddress: String,
        userAgent: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// অ্যাডমিন আইডি জেনারেট করার মিডলওয়্যার
adminSchema.pre("save", async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Admin").countDocuments();
    this.adminId = `ADM-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// পাসওয়ার্ড হ্যাশ করার মিডলওয়্যার
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// পাসওয়ার্ড চেক করার মেথড
adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ভার্চুয়াল ফিল্ড - বয়স 계산
adminSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// JSON এ ভার্চুয়াল ফিল্ড অন্তর্ভুক্ত করা
adminSchema.set("toJSON", { virtuals: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
