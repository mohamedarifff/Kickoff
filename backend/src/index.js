const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// routes
const organizationRequestRoutes = require("./routes/organizationRequestRoutes");
app.use("/api/organization-requests", organizationRequestRoutes);

app.get("/", (req, res) => {
  res.send("Kickoff Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
