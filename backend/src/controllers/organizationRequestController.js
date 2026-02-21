const OrganizationRequest = require("../models/OrganizationRequest");

// Helper regex
const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
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

    // 1️⃣ Check empty fields
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

    // 2️⃣ Validate organization name
    if (!nameRegex.test(organizationName)) {
      return res.status(400).json({
        message:
          "Organization name must contain only letters and spaces (no numbers or symbols)",
      });
    }

    if (organizationName.length < 3) {
      return res.status(400).json({
        message: "Organization name must be at least 3 characters long",
      });
    }

    // 3️⃣ Validate admin name
    if (!nameRegex.test(adminName)) {
      return res.status(400).json({
        message:
          "Admin name must contain only letters and spaces (no numbers or symbols)",
      });
    }

    // 4️⃣ Validate email
    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // 5️⃣ Validate purpose
    if (purpose.length < 10) {
      return res.status(400).json({
        message: "Purpose must be at least 10 characters long",
      });
    }

    // 6️⃣ Create request
    const request = await OrganizationRequest.create({
      organizationName: organizationName.trim(),
      adminName: adminName.trim(),
      adminEmail: adminEmail.toLowerCase().trim(),
      organizationType,
      purpose: purpose.trim(),
    });

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

    // 🔐 Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 🏢 Create Organization Admin account
    await OrganizationAdmin.create({
      organizationName: request.organizationName,
      email: request.adminEmail,
      password: hashedPassword,
      organizationType: request.organizationType,
      approvedBy: "Kickoff Support",
    });

    // 📧 Send email with credentials
    await sendEmail(
      request.adminEmail,
      "Kickoff Organization Approved",
      `Hello ${request.adminName},

Your organization "${request.organizationName}" has been approved.

Login Email: ${request.adminEmail}
Temporary Password: ${tempPassword}

Please login and change your password immediately.

Regards,
Kickoff Support Team`
    );

    // ✅ Update request status
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

    const request = await OrganizationRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Organization request not found",
      });
    }

    request.status = "rejected";
    request.reviewedBy = "Kickoff Support";
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      message: "Organization request rejected",
      data: request,
    });
  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

