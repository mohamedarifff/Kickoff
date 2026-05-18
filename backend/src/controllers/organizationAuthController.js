const OrganizationAdmin = require("../models/OrganizationAdmin");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");

/* =========================================
   ORGANIZATION LOGIN
========================================= */

exports.organizationLogin =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "All fields are required",

        });

      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const admin =
        await OrganizationAdmin.findOne({

          email:
            normalizedEmail,

        });

      if (!admin) {

        return res.status(401).json({

          message:
            "Invalid credentials",

        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!isMatch) {

        return res.status(401).json({

          message:
            "Invalid credentials",

        });

      }

      admin.lastLogin =
        new Date();

      await admin.save();

      const token =
        jwt.sign(

          {
            id: admin._id,

            role:
              "organization",

            organizationName:
              admin.organizationName,

            email:
              admin.email,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "1d",
          }

        );

      return res.status(200).json({

        message:
          "Login successful",

        token,

        mustChangePassword:
          admin.mustChangePassword ||
          false,

        admin: {

          organizationName:
            admin.organizationName,

          email:
            admin.email,

        },

      });

    } catch (error) {

      console.error(
        "ORG LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   CHANGE PASSWORD
========================================= */

exports.changePassword =
  async (req, res) => {

    try {

      const { newPassword } =
        req.body;

      const adminId =
        req.user.id;

      if (
        !newPassword ||
        newPassword.length < 6
      ) {

        return res.status(400).json({

          message:
            "Password must be at least 6 characters",

        });

      }

      const admin =
        await OrganizationAdmin.findById(
          adminId
        );

      if (!admin) {

        return res.status(404).json({

          message:
            "Organization not found",

        });

      }

      /* PASSWORD AUTO HASHES IN MODEL */

      admin.password =
        newPassword;

      admin.mustChangePassword =
        false;

      await admin.save();

      return res.status(200).json({

        message:
          "Password updated successfully",

      });

    } catch (error) {

      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   FORGOT PASSWORD
========================================= */

exports.forgotPassword =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      if (!email) {

        return res.status(400).json({

          message:
            "Email is required",

        });

      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const admin =
        await OrganizationAdmin.findOne({

          email:
            normalizedEmail,

        });

      if (!admin) {

        return res.status(404).json({

          message:
            "No organization account found",

        });

      }

      /* GENERATE OTP */

      const code =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      admin.resetCode =
        code;

      admin.resetCodeExpiry =
        Date.now() +
        5 * 60 * 1000;

      await admin.save();

      /* SEND EMAIL */

      await sendEmail(

        admin.email,

        "Kickoff Password Reset Code",

        `Your password reset code is: ${code}. This code expires in 5 minutes.`

      );

      return res.status(200).json({

        message:
          "Reset code sent to email",

      });

    } catch (error) {

      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   RESET PASSWORD
========================================= */

exports.resetPassword =
  async (req, res) => {

    try {

      const {

        email,

        code,

        newPassword,

      } = req.body;

      if (
        !email ||
        !code ||
        !newPassword
      ) {

        return res.status(400).json({

          message:
            "All fields are required",

        });

      }

      const admin =
        await OrganizationAdmin.findOne({

          email:
            email
              .toLowerCase()
              .trim(),

        });

      if (!admin) {

        return res.status(404).json({

          message:
            "Account not found",

        });

      }

      if (
        admin.resetCode !==
        code
      ) {

        return res.status(400).json({

          message:
            "Invalid reset code",

        });

      }

      if (
        !admin.resetCodeExpiry ||

        admin.resetCodeExpiry <
          Date.now()
      ) {

        return res.status(400).json({

          message:
            "Reset code expired",

        });

      }

      /* PASSWORD AUTO HASHES IN MODEL */

      admin.password =
        newPassword;

      admin.resetCode = null;

      admin.resetCodeExpiry =
        null;

      await admin.save();

      return res.status(200).json({

        message:
          "Password reset successful",

      });

    } catch (error) {

      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };