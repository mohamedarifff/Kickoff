const express = require("express");

const router = express.Router();

const {
  organizationLogin,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/organizationAuthController");

const organizationAuth = require("../middleware/organizationAuth");

/* =========================================
   AUTH
========================================= */

// Login
router.post(
  "/login",
  organizationLogin
);

// Forgot password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset password
router.post(
  "/reset-password",
  resetPassword
);

/* =========================================
   PROTECTED
========================================= */

// Change password
router.patch(
  "/change-password",
  organizationAuth,
  changePassword
);

module.exports = router;