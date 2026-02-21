const SupportUser = require("../models/SupportUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.supportLogin = async (req, res) => {
  try {

    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await SupportUser.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Support login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};