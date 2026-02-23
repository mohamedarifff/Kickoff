const express = require("express");
const router = express.Router();

const { 
    generateFixtures,
    getMatchesByLeague,
    scheduleMatch,
} = require("../controllers/matchController");

const organizationAuth = require("../middleware/organizationAuth");

// Generate fixtures
router.post("/generate/:leagueId", organizationAuth, generateFixtures);

router.get("/league/:leagueId", organizationAuth, getMatchesByLeague);

router.put("/schedule/:matchId", organizationAuth, scheduleMatch);  

module.exports = router;