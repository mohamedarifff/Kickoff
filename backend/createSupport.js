require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SupportUser = require("./src/models/SupportUser"); // adjust if name differs

async function createSupport() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const hashedPassword = await bcrypt.hash("adminkickoff", 10);

    const existing = await SupportUser.findOne({
      email: "support@kickoff.com",
    });

    if (existing) {
      console.log("Support user already exists");
      process.exit();
    }

    await SupportUser.create({
      name: "Kickoff Support",
      email: "support@kickoff.com",
      password: hashedPassword,
      role: "support",
    });

    console.log("Support user created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createSupport();
