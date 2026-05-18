const express = require("express");

const router = express.Router();

const {

  generateFixtures,

  getMatchesByLeague,

  getMatchById,

  getLiveMatches,

  scheduleMatch,

  startMatch,

  pauseMatch,

  resumeMatch,

  halfTime,

  startSecondHalf,

  updateScore,

  endMatch,

} = require(
  "../controllers/matchController"
);

const organizationAuth =
  require(
    "../middleware/organizationAuth"
  );

/* =========================================
   PUBLIC
========================================= */

// Public live matches
router.get(
  "/public/live",
  getLiveMatches
);

/* =========================================
   FIXTURES
========================================= */

// Generate fixtures
router.post(
  "/generate/:leagueId",
  organizationAuth,
  generateFixtures
);

/* =========================================
   MATCHES
========================================= */

// Get matches by league
router.get(
  "/league/:leagueId",
  organizationAuth,
  getMatchesByLeague
);

// Get single match
router.get(
  "/:matchId",
  organizationAuth,
  getMatchById
);

// Schedule match
router.put(
  "/schedule/:matchId",
  organizationAuth,
  scheduleMatch
);

/* =========================================
   MATCH CONTROL
========================================= */

// Start match
router.put(
  "/start/:matchId",
  organizationAuth,
  startMatch
);

// Pause match
router.put(
  "/pause/:matchId",
  organizationAuth,
  pauseMatch
);

// Resume match
router.put(
  "/resume/:matchId",
  organizationAuth,
  resumeMatch
);

// Half time
router.put(
  "/halftime/:matchId",
  organizationAuth,
  halfTime
);

// Start second half
router.put(
  "/secondhalf/:matchId",
  organizationAuth,
  startSecondHalf
);

// Update score
router.put(
  "/score/:matchId",
  organizationAuth,
  updateScore
);

// End match
router.put(
  "/end/:matchId",
  organizationAuth,
  endMatch
);

module.exports = router;