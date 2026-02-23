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

// 🔹 Organization Auth routes
const organizationAuthRoutes = require("./routes/organizationAuthRoutes");
app.use("/api/org", organizationAuthRoutes);

// 🔹League Routes
const leagueRoutes = require("./routes/leagueRoutes");
app.use("/api/leagues", leagueRoutes);

// 🔹Team Routes
const teamRoutes = require("./routes/teamRoutes");
app.use("/api/teams", teamRoutes);

// 🔹 Match Routes
const matchRoutes = require("./routes/matchRoutes");
app.use("/api/matches", matchRoutes); 

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Kickoff Backend is running");
});

const publicRoutes = require("./routes/publicRoutes");
app.use("/api/public", publicRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
