const mongoose = require("mongoose");

const organizationAdminSchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    organizationType: {
      type: String,
      enum: ["college", "club", "local"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    approvedBy: {
      type: String,
      default: "Kickoff Support",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    /* =====================================
       PASSWORD RESET
    ===================================== */

    resetCode: {
      type: String,
      default: null,
    },

    resetCodeExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "OrganizationAdmin",
  organizationAdminSchema
);