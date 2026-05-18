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
      enum: [
        "league",
        "group",
        "quarterfinal",
        "semifinal",
        "final",
      ],
      default: "league",
    },

    group: {
      type: String,
      default: "",
    },

    matchDate: {
      type: Date,
      default: null,
    },

    homeScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    awayScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "live",
        "paused",
        "half-time",
        "completed",
      ],
      default: "pending",
    },

    currentHalf: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    firstHalfStart: {
      type: Date,
      default: null,
    },

    secondHalfStart: {
      type: Date,
      default: null,
    },

    pausedAt: {
      type: Date,
      default: null,
    },

    totalPausedDuration: {
      type: Number,
      default: 0,
    },

    pauseReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "Match",
  matchSchema
);