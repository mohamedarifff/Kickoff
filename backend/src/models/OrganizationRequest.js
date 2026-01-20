const mongoose = require("mongoose");

const organizationRequestSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    adminName: {
      type: String,
      required: true,
      trim: true,
    },

    adminEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    organizationType: {
      type: String,
      enum: ["college", "club", "local"],
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: String, // Kickoff support identifier
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrganizationRequest",
  organizationRequestSchema
);
