const express = require("express");
const router = express.Router();

const {
  createOrganizationRequest,
} = require("../controllers/organizationRequestController");

// Submit organization request
router.post("/request", createOrganizationRequest);

module.exports = router;
