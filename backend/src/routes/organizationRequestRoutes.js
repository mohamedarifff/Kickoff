const express = require("express");
const router = express.Router();

const {
  createOrganizationRequest,
  getOrganizationRequests,
  approveOrganizationRequest,
  rejectOrganizationRequest,
} = require("../controllers/organizationRequestController");

// ✅ USE SUPPORT AUTH (JWT)
const supportAuth = require("../middleware/supportAuth");

// Support team - view requests
router.get("/", supportAuth, getOrganizationRequests);

// Support team - approve / reject
router.patch("/:id/approve", supportAuth, approveOrganizationRequest);
router.patch("/:id/reject", supportAuth, rejectOrganizationRequest);

// Organization submits request (PUBLIC)
router.post("/request", createOrganizationRequest);

module.exports = router;
