const League = require(
  "../models/League"
);

const Team = require(
  "../models/Team"
);

const Match = require(
  "../models/Match"
);

const cloudinary = require(
  "../config/cloudinary"
);

const fs = require("fs");

/* =========================================
   CREATE LEAGUE
========================================= */

exports.createLeague =
  async (req, res) => {

    try {

      let {
        name,
        season,
        format,
        numberOfTeams,
        description,
      } = req.body;

      /* VALIDATION */

      if (
        !name ||
        !season ||
        !numberOfTeams
      ) {

        return res.status(400).json({
          message:
            "Name, season and number of teams are required",
        });

      }

      numberOfTeams =
        Number(numberOfTeams);

      if (
        isNaN(numberOfTeams)
      ) {

        return res.status(400).json({
          message:
            "Invalid number of teams",
        });

      }

      if (
        numberOfTeams < 2
      ) {

        return res.status(400).json({
          message:
            "League must have at least 2 teams",
        });

      }

      const trimmedName =
        name.trim();

      const trimmedSeason =
        season.trim();

      /* VALID FORMATS */

      const validFormats = [
        "round_robin",
        "knockout",
        "group_knockout",
      ];

      if (
        format &&
        !validFormats.includes(
          format
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid league format",
        });

      }

      /* DUPLICATE CHECK */

      const existingLeague =
        await League.findOne({
          name: trimmedName,
          season:
            trimmedSeason,
          organizationId:
            req.user.id,
        });

      if (
        existingLeague
      ) {

        return res.status(400).json({
          message:
            "League already exists for this season",
        });

      }

      let logoUrl = "";

      /* CLOUDINARY UPLOAD */

      if (req.file) {

        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              folder:
                "kickoff_leagues",
            }
          );

        logoUrl =
          result.secure_url;

        /* DELETE TEMP FILE */

        try {

          fs.unlinkSync(
            req.file.path
          );

        } catch (err) {

          console.log(
            "Temp file delete failed"
          );

        }
      }

      /* CREATE LEAGUE */

      const league =
        await League.create({

          name: trimmedName,

          season:
            trimmedSeason,

          format:
            format ||
            "round_robin",

          numberOfTeams,

          description:
            description || "",

          logo: logoUrl,

          organizationId:
            req.user.id,

          status: "draft",

        });

      return res.status(201).json({

        message:
          "League created successfully",

        league,

      });

    } catch (error) {

      console.error(
        "CREATE LEAGUE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   GET LEAGUES
========================================= */

exports.getLeagues =
  async (req, res) => {

    try {

      const leagues =
        await League.find({
          organizationId:
            req.user.id,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({

        count:
          leagues.length,

        leagues,

      });

    } catch (error) {

      console.error(
        "GET LEAGUES ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   UPDATE LEAGUE
========================================= */

exports.updateLeague =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

      const {
        name,
        season,
        format,
        status,
      } = req.body;

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

      const validFormats = [
        "round_robin",
        "knockout",
        "group_knockout",
      ];

      if (
        format &&
        !validFormats.includes(
          format
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid league format",
        });

      }

      if (name) {

        league.name =
          name.trim();

      }

      if (season) {

        league.season =
          season.trim();

      }

      if (format) {

        league.format =
          format;

      }

      if (status) {

        league.status =
          status;

      }

      await league.save();

      return res.status(200).json({

        message:
          "League updated successfully",

        league,

      });

    } catch (error) {

      console.error(
        "UPDATE LEAGUE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };

/* =========================================
   DELETE LEAGUE
========================================= */

exports.deleteLeague =
  async (req, res) => {

    try {

      const { leagueId } =
        req.params;

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

      /* DELETE RELATED TEAMS */

      await Team.deleteMany({
        leagueId,
      });

      /* DELETE RELATED MATCHES */

      await Match.deleteMany({
        leagueId,
      });

      /* DELETE LEAGUE */

      await League.findByIdAndDelete(
        leagueId
      );

      return res.status(200).json({
        message:
          "League deleted successfully",
      });

    } catch (error) {

      console.error(
        "DELETE LEAGUE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });

    }
  };