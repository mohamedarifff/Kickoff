const express = require("express");
const router = express.Router();

const {
  createOrganizationRequest,
  getOrganizationRequests,
  approveOrganizationRequest,
  rejectOrganizationRequest,
} = require("../controllers/organizationRequestController");

const { adminAuth } = require("../middleware/adminAuth");

// Support team - view requests
router.get("/", getOrganizationRequests);

// Support team - approve / reject
router.patch("/:id/approve", adminAuth, approveOrganizationRequest);
router.patch("/:id/reject", adminAuth, rejectOrganizationRequest);

// Organization submits request
router.post("/request", createOrganizationRequest);

module.exports = router;
