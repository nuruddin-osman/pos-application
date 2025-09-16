// const express = require("express");
// const Patients = require("../../models/appointment/patients.model");
// const router = express.Router();

// // সব রোগী পাওয়ার জন্য
// router.get("/", async (req, res) => {
//   try {
//     const { search } = req.query;

//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//         ],
//       };
//     }

//     const patients = await Patients.find(query);
//     res.json(patients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
