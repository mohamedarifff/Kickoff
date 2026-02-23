const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    leagueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },

    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    round: {
      type: Number,
      default: 1,
    },

    stage: {
      type: String,
      enum: ["league", "group", "quarterfinal", "semifinal", "final"],
      default: "league",
    },

    group: {
      type: String, // "A", "B", etc (only for group stage)
    },

    matchDate: {
      type: Date,
      default: null,
    },

    homeScore: {
      type: Number,
      default: 0,
    },

    awayScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);