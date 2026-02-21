const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createLeague,
  getLeagues,
} = require("../controllers/leagueController");

const organizationAuth = require("../middleware/organizationAuth");

// Temporary local storage before Cloudinary upload
const upload = multer({ dest: "uploads/" });

// Create league (with logo upload)
router.post(
  "/",
  organizationAuth,
  upload.single("logo"),
  createLeague
);

// Get all leagues of logged-in organization
router.get("/", organizationAuth, getLeagues);

module.exports = router;