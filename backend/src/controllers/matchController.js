const fixtureService = require(
  "../services/fixtureService"
);

const Match = require(
  "../models/Match"
);

const League = require(
  "../models/League"
);

const Team = require(
  "../models/Team"
);

/* =========================================
   AUTHORIZED MATCH CHECK
========================================= */

const getAuthorizedMatch =
  async (matchId, userId) => {

    const match =
      await Match.findById(
        matchId
      );

    if (!match) {
      return null;
    }

    const league =
      await League.findOne({
        _id: match.leagueId,
        organizationId:
          userId,
      });

    if (!league) {
      return null;
    }

    return match;
  };

/* =========================================
   GENERATE FIXTURES
========================================= */

exports.generateFixtures =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

      const result =
        await fixtureService.generateFixtures(
          leagueId
        );

      return res.status(201).json({

        message:
          "Fixtures generated successfully",

        ...result,

      });

    } catch (error) {

      console.error(
        "FIXTURE ERROR:",
        error.message
      );

      return res.status(400).json({

        message:
          error.message ||
          "Server error",

      });

    }
  };

/* =========================================
   GET MATCHES BY LEAGUE
========================================= */

exports.getMatchesByLeague =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

      const matches =
        await Match.find({
          leagueId,
        })
          .populate(
            "homeTeam"
          )
          .populate(
            "awayTeam"
          )
          .sort({
            round: 1,
          });

      return res.status(200).json({
        matches,
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   GET MATCH BY ID
========================================= */

exports.getMatchById =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      await match.populate(
        "homeTeam"
      );

      await match.populate(
        "awayTeam"
      );

      await match.populate(
        "leagueId"
      );

      return res.status(200).json({
        match,
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   GET LIVE MATCHES
========================================= */

exports.getLiveMatches =
  async (req, res) => {

    try {

      const matches =
        await Match.find({

          status: {
            $in: [
              "live",
              "half-time",
              "paused",
            ],
          },

        })
          .populate(
            "homeTeam"
          )
          .populate(
            "awayTeam"
          )
          .populate(
            "leagueId"
          )
          .sort({
            updatedAt: -1,
          });

      return res.status(200).json({
        matches,
      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   SCHEDULE MATCH
========================================= */

exports.scheduleMatch =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const { matchDate } =
        req.body;

      if (!matchDate) {

        return res.status(400).json({

          message:
            "Match date required",

        });

      }

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      match.matchDate =
        new Date(matchDate);

      match.status =
        "scheduled";

      await match.save();

      return res.status(200).json({

        message:
          "Match scheduled successfully",

        match,

      });

    } catch (error) {

      console.error(
        "Schedule Error:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   START MATCH
========================================= */

exports.startMatch =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      if (
        match.status ===
        "completed"
      ) {

        return res.status(400).json({

          message:
            "Match already completed",

        });

      }

      match.status =
        "live";

      match.currentHalf = 1;

      match.firstHalfStart =
        new Date();

      match.totalPausedDuration = 0;

      await match.save();

      return res.status(200).json({

        message:
          "Match started",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   PAUSE MATCH
========================================= */

exports.pauseMatch =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      if (
        match.status !==
        "live"
      ) {

        return res.status(400).json({

          message:
            "Match is not live",

        });

      }

      match.status =
        "paused";

      match.pausedAt =
        new Date();

      await match.save();

      return res.status(200).json({

        message:
          "Match paused",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   RESUME MATCH
========================================= */

exports.resumeMatch =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      if (
        match.status !==
        "paused"
      ) {

        return res.status(400).json({

          message:
            "Match is not paused",

        });

      }

      const pauseDuration =
        Date.now() -
        new Date(
          match.pausedAt
        );

      match.totalPausedDuration +=
        pauseDuration;

      match.pausedAt = null;

      match.status = "live";

      await match.save();

      return res.status(200).json({

        message:
          "Match resumed",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   HALF TIME
========================================= */

exports.halfTime =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      match.status =
        "half-time";

      await match.save();

      return res.status(200).json({

        message:
          "Half time",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   START SECOND HALF
========================================= */

exports.startSecondHalf =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      match.status =
        "live";

      match.currentHalf = 2;

      match.secondHalfStart =
        new Date();

      await match.save();

      return res.status(200).json({

        message:
          "Second half started",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   UPDATE SCORE
========================================= */

exports.updateScore =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const {
        homeScore,
        awayScore,
      } = req.body;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      if (
        homeScore < 0 ||
        awayScore < 0
      ) {

        return res.status(400).json({

          message:
            "Invalid score",

        });

      }

      if (
        homeScore !== undefined
      ) {

        match.homeScore =
          homeScore;

      }

      if (
        awayScore !== undefined
      ) {

        match.awayScore =
          awayScore;

      }

      await match.save();

      return res.status(200).json({

        message:
          "Score updated",

        match,

      });

    } catch (error) {

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };

/* =========================================
   END MATCH
========================================= */

exports.endMatch =
  async (req, res) => {

    try {

      const { matchId } =
        req.params;

      const match =
        await getAuthorizedMatch(
          matchId,
          req.user.id
        );

      if (!match) {

        return res.status(404).json({

          message:
            "Match not found",

        });

      }

      if (
        match.status ===
        "completed"
      ) {

        return res.status(400).json({

          message:
            "Match already completed",

        });

      }

      const homeTeam =
        await Team.findById(
          match.homeTeam
        );

      const awayTeam =
        await Team.findById(
          match.awayTeam
        );

      if (
        !homeTeam ||
        !awayTeam
      ) {

        return res.status(404).json({

          message:
            "Teams not found",

        });

      }

      homeTeam.played += 1;
      awayTeam.played += 1;

      homeTeam.goalsFor +=
        match.homeScore;

      homeTeam.goalsAgainst +=
        match.awayScore;

      awayTeam.goalsFor +=
        match.awayScore;

      awayTeam.goalsAgainst +=
        match.homeScore;

      if (
        match.homeScore >
        match.awayScore
      ) {

        homeTeam.wins += 1;

        homeTeam.points += 3;

        awayTeam.losses += 1;

      }

      else if (
        match.homeScore <
        match.awayScore
      ) {

        awayTeam.wins += 1;

        awayTeam.points += 3;

        homeTeam.losses += 1;

      }

      else {

        homeTeam.draws += 1;
        awayTeam.draws += 1;

        homeTeam.points += 1;
        awayTeam.points += 1;

      }

      await homeTeam.save();

      await awayTeam.save();

      match.status =
        "completed";

      await match.save();

      return res.status(200).json({

        message:
          "Match completed",

        match,

      });

    } catch (error) {

      console.error(
        "END MATCH ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server error",

      });

    }
  };