const express = require("express");
const User = require("../../models/users/user.model");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, password, dob, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this phone or email",
      });
    }

    // Create new user
    const user = new User({
      fullName,
      phone,
      email,
      password, // Note: Password should be hashed
      dob: new Date(dob),
      gender,
    });

    // Save to database
    await user.save();

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;

// app.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username: username });
//     if (user) {
//       return res.status(400).send("User already axist");
//     }
//     bcrypt.hash(password, saltRounds, async (err, hash) => {
//       const newUser = new User({
//         username: username,
//         password: hash,
//       });
//       await newUser
//         .save()
//         .then(() => {
//           return res.status(201).send({
//             status: true,
//             message: "user create success",
//             data: newUser,
//           });
//         })
//         .catch((error) => {
//           return res.send({
//             status: false,
//             message: "user is not create ",
//           });
//         });
//     });
//   } catch (error) {
//     res.status(500).send({ message: "Internal server error" });
//   }
// });
