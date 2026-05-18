const Team = require(
  "../models/Team"
);

const League = require(
  "../models/League"
);

const mongoose = require(
  "mongoose"
);

/* =========================================
   CREATE TEAM
========================================= */

exports.createTeam =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

      let {
        name,
        coachName,
        logo,
      } = req.body;

      /* VALIDATE IDS */

      if (
        !mongoose.Types.ObjectId.isValid(
          leagueId
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid league ID",
        });

      }

      /* VALIDATION */

      if (!name) {

        return res.status(400).json({
          message:
            "Team name is required",
        });

      }

      name = name.trim();

      if (!name) {

        return res.status(400).json({
          message:
            "Invalid team name",
        });

      }

      /* LEAGUE CHECK */

      const league =
        await League.findOne({
          _id: leagueId,
          organizationId:
            req.user.id,
        });

      if (!league) {

        return res.status(404).json({
          message:
            "League not found",
        });

      }

      /* TEAM LIMIT */

      const teamCount =
        await Team.countDocuments({
          leagueId,
          organizationId:
            req.user.id,
        });

      if (
        teamCount >=
        league.numberOfTeams
      ) {

        return res.status(400).json({
          message:
            "League capacity reached",
        });

      }

      /* DUPLICATE CHECK */

      const existingTeam =
        await Team.findOne({
          name,
          leagueId,
        });

      if (
        existingTeam
      ) {

        return res.status(400).json({
          message:
            "Team already exists in this league",
        });

      }

      /* CREATE TEAM */

      const team =
        await Team.create({

          name,

          coachName:
            coachName || "",

          logo:
            logo || "",

          leagueId,

          organizationId:
            req.user.id,

        });

      return res.status(201).json({

        message:
          "Team created successfully",

        team,

      });

    } catch (error) {

      console.error(
        "CREATE TEAM ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   GET TEAMS BY LEAGUE
========================================= */

exports.getTeamsByLeague =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

      const teams =
        await Team.find({

          leagueId,

          organizationId:
            req.user.id,

        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({

        count:
          teams.length,

        teams,

      });

    } catch (error) {

      console.error(
        "GET TEAMS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   GET SINGLE TEAM
========================================= */

exports.getTeamById =
  async (req, res) => {

    try {

      const { teamId } =
        req.params;

      const team =
        await Team.findOne({

          _id: teamId,

          organizationId:
            req.user.id,

        });

      if (!team) {

        return res.status(404).json({
          message:
            "Team not found",
        });

      }

      return res.status(200).json({
        team,
      });

    } catch (error) {

      console.error(
        "GET TEAM ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   UPDATE TEAM
========================================= */

exports.updateTeam =
  async (req, res) => {

    try {

      const { teamId } =
        req.params;

      const updates = {};

      if (req.body.name) {

        updates.name =
          req.body.name.trim();

      }

      if (
        req.body.coachName !==
        undefined
      ) {

        updates.coachName =
          req.body.coachName;

      }

      if (
        req.body.logo !==
        undefined
      ) {

        updates.logo =
          req.body.logo;

      }

      const team =
        await Team.findOneAndUpdate(

          {
            _id: teamId,
            organizationId:
              req.user.id,
          },

          updates,

          { new: true }

        );

      if (!team) {

        return res.status(404).json({
          message:
            "Team not found",
        });

      }

      return res.status(200).json({

        message:
          "Team updated successfully",

        team,

      });

    } catch (error) {

      console.error(
        "UPDATE TEAM ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   DELETE TEAM
========================================= */

exports.deleteTeam =
  async (req, res) => {

    try {

      const { teamId } =
        req.params;

      const team =
        await Team.findOneAndDelete({

          _id: teamId,

          organizationId:
            req.user.id,

        });

      if (!team) {

        return res.status(404).json({
          message:
            "Team not found",
        });

      }

      return res.status(200).json({

        message:
          "Team deleted successfully",

      });

    } catch (error) {

      console.error(
        "DELETE TEAM ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };