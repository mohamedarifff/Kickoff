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
      enum: ["round_robin", "knockout", "group_knockout"],
      default: "round_robin",
    },

    roundRobinType: {
      type: String,
      enum: ["single", "double"],
      default: "single",
    },

    groups: {
      type: Number,
      default: 0,
    },

    numberOfTeams: {
      type: Number,
      required: true,
      min: 2,
    },

    status: {
      type: String,
      enum: ["draft", "fixtures_generated", "ongoing", "completed"],
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