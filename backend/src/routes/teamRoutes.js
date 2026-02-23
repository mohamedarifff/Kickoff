const express = require("express");
const router = express.Router();

const {
  createTeam,
  getTeamsByLeague,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");

const organizationAuth = require("../middleware/organizationAuth");

// League-based routes
router.post("/league/:leagueId", organizationAuth, createTeam);
router.get("/league/:leagueId", organizationAuth, getTeamsByLeague);

// Team-based routes
router.get("/:teamId", organizationAuth, getTeamById);
router.put("/:teamId", organizationAuth, updateTeam);
router.delete("/:teamId", organizationAuth, deleteTeam);

module.exports = router;