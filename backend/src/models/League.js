const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    season: {
      type: String,
      required: true,
      trim: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationAdmin",
      required: true,
    },

    /* =========================
       LEAGUE FORMAT
    ========================= */

    format: {
      type: String,
      enum: [
        "round_robin",
        "knockout",
        "hybrid",
      ],
      default: "round_robin",
    },

    /* =========================
       ROUND ROBIN SETTINGS
    ========================= */

    roundRobinType: {
      type: String,
      enum: ["single", "double"],
      default: "single",
    },

    /* =========================
       HYBRID SETTINGS
    ========================= */

    groups: {
      type: Number,
      default: 0,
    },

    /* =========================
       TEAM SETTINGS
    ========================= */

    numberOfTeams: {
      type: Number,
      required: true,
      min: 2,
    },

    /* =========================
       LEAGUE STATUS
    ========================= */

    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "completed",
      ],
      default: "draft",
    },

    /* =========================
       DESCRIPTION
    ========================= */

    description: {
      type: String,
      default: "",
    },

    /* =========================
       LEAGUE LOGO
    ========================= */

    logo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "League",
  leagueSchema
);