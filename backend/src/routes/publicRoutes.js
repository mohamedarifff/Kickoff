const express = require("express");
const router = express.Router();

const League = require("../models/League");
const Match = require("../models/Match");
const Team = require("../models/Team");

/* ---------------- GET ALL LEAGUES ---------------- */
router.get("/leagues", async (req, res) => {
  const leagues = await League.find({
    status: { $ne: "draft" },
  });

  res.json({ leagues });
});

/* ---------------- GET SINGLE LEAGUE ---------------- */
router.get("/leagues/:leagueId", async (req, res) => {
  const league = await League.findById(req.params.leagueId);
  res.json({ league });
});

/* ---------------- GET MATCHES ---------------- */
router.get("/leagues/:leagueId/matches", async (req, res) => {
  const matches = await Match.find({
    leagueId: req.params.leagueId,
  })
    .populate("homeTeam", "name logo")
    .populate("awayTeam", "name logo")
    .sort({ matchDate: 1 });

  res.json({ matches });
});

/* ---------------- GET STANDINGS ---------------- */
router.get("/leagues/:leagueId/standings", async (req, res) => {
  const teams = await Team.find({
    leagueId: req.params.leagueId,
  }).sort({ points: -1, goalDifference: -1 });

  res.json({ teams });
});

module.exports = router;