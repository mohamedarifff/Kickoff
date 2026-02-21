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

    format: {
      type: String,
      enum: ["round-robin", "knockout", "hybrid"],
      default: "round-robin",
    },

    numberOfTeams: {
      type: Number,
      required: true,
      min: 2,
    },

    status: {
      type: String,
      enum: ["draft", "ongoing", "completed"],
      default: "draft",
    },

    description: {
      type: String,
      default: "",
    },

    logo: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("League", leagueSchema);