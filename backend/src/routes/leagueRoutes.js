const express = require("express");

const router = express.Router();

const {

  createLeague,

  getLeagues,

  updateLeague,

  deleteLeague,

} = require(
  "../controllers/leagueController"
);

const organizationAuth = require(
  "../middleware/organizationAuth"
);

/* =========================================
   CREATE LEAGUE
========================================= */

router.post(
  "/",
  organizationAuth,
  createLeague
);

/* =========================================
   GET LEAGUES
========================================= */

router.get(
  "/",
  organizationAuth,
  getLeagues
);

/* =========================================
   UPDATE LEAGUE
========================================= */

router.put(
  "/:leagueId",
  organizationAuth,
  updateLeague
);

/* =========================================
   DELETE LEAGUE
========================================= */

router.delete(
  "/:leagueId",
  organizationAuth,
  deleteLeague
);

module.exports = router;