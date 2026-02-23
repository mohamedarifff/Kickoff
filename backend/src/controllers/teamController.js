const Team = require("../models/Team");
const League = require("../models/League");

// ===============================
// Create Team
// ===============================
exports.createTeam = async (req, res) => {
  try {
    const { leagueId } = req.params;
    const { name, coachName, logo } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const league = await League.findOne({
      _id: leagueId,
      organizationId: req.user.id,
    });

    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    const teamCount = await Team.countDocuments({
      leagueId,
      organizationId: req.user.id,
    });

    if (teamCount >= league.numberOfTeams) {
      return res.status(400).json({
        message: "League capacity reached",
      });
    }

    const existingTeam = await Team.findOne({
      name: name.trim(),
      leagueId,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team already exists in this league",
      });
    }

    const team = await Team.create({
      name: name.trim(),
      coachName: coachName || "",
      logo: logo || "",
      leagueId,
      organizationId: req.user.id,
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    console.error("CREATE TEAM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get Teams by League
// ===============================
exports.getTeamsByLeague = async (req, res) => {
  try {
    const { leagueId } = req.params;

    const teams = await Team.find({
      leagueId,
      organizationId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: teams.length,
      teams,
    });

  } catch (error) {
    console.error("GET TEAMS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get Single Team
// ===============================
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({
      _id: teamId,
      organizationId: req.user.id,
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({ team });

  } catch (error) {
    console.error("GET TEAM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Update Team
// ===============================
exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, coachName, logo } = req.body;

    const team = await Team.findOneAndUpdate(
      {
        _id: teamId,
        organizationId: req.user.id,
      },
      {
        name: name?.trim(),
        coachName,
        logo,
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      message: "Team updated successfully",
      team,
    });

  } catch (error) {
    console.error("UPDATE TEAM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Delete Team
// ===============================
exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOneAndDelete({
      _id: teamId,
      organizationId: req.user.id,
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      message: "Team deleted successfully",
    });

  } catch (error) {
    console.error("DELETE TEAM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};