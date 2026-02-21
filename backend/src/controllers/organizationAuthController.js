const OrganizationAdmin = require("../models/OrganizationAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Organization Login
// ===============================
exports.organizationLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await OrganizationAdmin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "organization",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      mustChangePassword: admin.mustChangePassword || false,
      admin: {
        organizationName: admin.organizationName,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("ORG LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// Change Password
// ===============================
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const adminId = req.user.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await OrganizationAdmin.findByIdAndUpdate(adminId, {
      password: hashedPassword,
      mustChangePassword: false,
    });

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};