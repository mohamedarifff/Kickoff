const OrganizationRequest = require("../models/OrganizationRequest");

// Helper regex
const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Submit organization request
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
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
