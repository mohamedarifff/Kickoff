const mongoose = require("mongoose");

const organizationAdminSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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

    approvedBy: {
      type: String,
      default: "Kickoff Support",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrganizationAdmin",
  organizationAdminSchema
);
