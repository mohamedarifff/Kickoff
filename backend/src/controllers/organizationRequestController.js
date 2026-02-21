const OrganizationRequest = require("../models/OrganizationRequest");

const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const OrganizationAdmin = require("../models/OrganizationAdmin");


// ===============================
// Submit organization request
// ===============================
exports.createOrganizationRequest = async (req, res) => {
  try {
    const {
      organizationName,
      adminName,
      adminEmail,
      organizationType,
      purpose,
    } = req.body;

    if (
      !organizationName ||
      !adminName ||
      !adminEmail ||
      !organizationType ||
      !purpose
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!nameRegex.test(organizationName) || organizationName.length < 3) {
      return res.status(400).json({
        message: "Invalid organization name",
      });
    }

    if (!nameRegex.test(adminName)) {
      return res.status(400).json({
        message: "Invalid admin name",
      });
    }

    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (purpose.length < 10) {
      return res.status(400).json({
        message: "Purpose must be at least 10 characters long",
      });
    }

    const normalizedEmail = adminEmail.toLowerCase().trim();

    // 🚫 Block if already approved (admin account exists)
    const existingAdmin = await OrganizationAdmin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message:
          "This organization is already approved and has login credentials.",
      });
    }

    // 🚫 Block if already pending
    const existingPending = await OrganizationRequest.findOne({
      adminEmail: normalizedEmail,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        message:
          "An application with this email is already under review.",
      });
    }

    // ✅ Allow reapply if previous request was rejected

    const request = await OrganizationRequest.create({
      organizationName: organizationName.trim(),
      adminName: adminName.trim(),
      adminEmail: normalizedEmail,
      organizationType,
      purpose: purpose.trim(),
    });

    // 📧 Confirmation email
    await sendEmail(
      normalizedEmail,
      "Kickoff Application Received",
      `Hello ${adminName},

Your organization request for "${organizationName}" has been received.

Our support team will review your application shortly.

You will receive an email once it is approved or rejected.

Regards,
Kickoff Support Team`
    );

    res.status(201).json({
      message: "Organization request submitted successfully",
      data: request,
    });

  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ===============================
// Support Team - Get all requests
// ===============================
exports.getOrganizationRequests = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const requests = await OrganizationRequest.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: requests.length,
      data: requests,
    });

  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ===============================
// Approve organization request
// ===============================
exports.approveOrganizationRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await OrganizationRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Organization request not found",
      });
    }

    if (request.status === "approved") {
      return res.status(400).json({
        message: "Request already approved",
      });
    }

    const normalizedEmail = request.adminEmail.toLowerCase().trim();

    const existingAdmin = await OrganizationAdmin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Organization admin already exists",
      });
    }

    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await OrganizationAdmin.create({
      organizationName: request.organizationName,
      adminName: request.adminName,
      email: normalizedEmail,
      password: hashedPassword,
      organizationType: request.organizationType,
      approvedBy: "Kickoff Support",
      mustChangePassword: true,
    });

    await sendEmail(
      normalizedEmail,
      "Kickoff Organization Approved",
      `Hello ${request.adminName},

Your organization "${request.organizationName}" has been approved.

Login Email: ${normalizedEmail}
Temporary Password: ${tempPassword}

Please login and change your password immediately.

Regards,
Kickoff Support Team`
    );

    request.status = "approved";
    request.reviewedBy = "Kickoff Support";
    request.reviewedAt = new Date();
    await request.save();

    res.status(200).json({
      message: "Organization approved and credentials sent via email",
    });

  } catch (error) {
    console.error("APPROVE ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ===============================
// Reject organization request
// ===============================
exports.rejectOrganizationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const request = await OrganizationRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Organization request not found",
      });
    }

    request.status = "rejected";
    request.rejectionReason =
      reason || "Application did not meet platform requirements";
    request.reviewedBy = "Kickoff Support";
    request.reviewedAt = new Date();

    await request.save();

    await sendEmail(
      request.adminEmail,
      "Kickoff Organization Application Rejected",
      `Hello ${request.adminName},

We regret to inform you that your organization "${request.organizationName}" has been rejected.

Reason:
${request.rejectionReason}

You may submit a new request if you wish.

Regards,
Kickoff Support Team`
    );

    res.status(200).json({
      message: "Organization request rejected and email sent",
    });

  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};