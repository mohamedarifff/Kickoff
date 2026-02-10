const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS (must be before routes)
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ================= ROUTES =================

// 🔹 Support authentication routes
const supportAuthRoutes = require("./routes/supportAuthRoutes");
app.use("/api/support", supportAuthRoutes);

// 🔹 Organization request routes
const organizationRequestRoutes = require("./routes/organizationRequestRoutes");
app.use("/api/organization-requests", organizationRequestRoutes);

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Kickoff Backend is running");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
