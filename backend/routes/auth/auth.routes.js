const express = require("express");
const User = require("../../models/users/user.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, password, dob, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this phone or email",
      });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      // Create new user
      const user = new User({
        fullName,
        phone,
        email,
        password: hash,
        dob,
        gender,
      });
      await user
        .save()
        .then(async () => {
          return res.status(201).json({
            status: "success",
            message: "User create successfull",
            data: user,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            status: false,
            message: "User in not created",
          });
        });
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    const user = await User.findOne({
      $or: [{ phone: phone }, { email: email }],
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User in not found",
      });
    }

    const passwordMatchCheck = await bcrypt.compare(password, user.password);
    if (!passwordMatchCheck) {
      res.status(400).json({
        status: false,
        message: "Password did not match",
      });
    }
    const payload = {
      id: user._id,
      phone: user.phone,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.SECRETE_KEY, {
      expiresIn: "2d",
    });

    const withoutPassword = { ...user.toObject() };
    delete withoutPassword.password;

    res.status(200).send({
      status: true,
      message: "Login success",
      user: withoutPassword,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user?._conditions?._id || req.user?._id;

      const user = await User.findById(userId).select("-password").lean();

      res.status(200).json({
        status: true,
        message: "Profile retrieved successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  }
);

module.exports = router;
