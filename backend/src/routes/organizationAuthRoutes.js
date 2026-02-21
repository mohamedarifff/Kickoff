const express = require("express");
const router = express.Router();

const {
  organizationLogin,
  changePassword,
} = require("../controllers/organizationAuthController");

const organizationAuth = require("../middleware/organizationAuth");

// Login
router.post("/login", organizationLogin);

// Change password (protected)
router.patch("/change-password", organizationAuth, changePassword);

module.exports = router;