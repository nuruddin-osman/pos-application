const mongoose = require("mongoose");
require("dotenv").config();
// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/pos_for_hospital"
  )
  .then(() => console.log("MongoDB is Conneted"))
  .catch((err) => console.error("MongoDB is not Connected", err));
