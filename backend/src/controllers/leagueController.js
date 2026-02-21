const League = require("../models/League");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
// ===============================
// Create League
// ===============================
exports.createLeague = async (req, res) => {
  try {
    const { name, season, format, numberOfTeams, description } = req.body;

    if (!name || !season || !numberOfTeams) {
      return res.status(400).json({
        message: "Name, season and number of teams are required",
      });
    }

    if (numberOfTeams < 2) {
      return res.status(400).json({
        message: "League must have at least 2 teams",
      });
    }

    const trimmedName = name.trim();
    const trimmedSeason = season.trim();

    // 🔒 Prevent duplicate league per season per organization
    const existingLeague = await League.findOne({
      name: trimmedName,
      season: trimmedSeason,
      organizationId: req.user.id,
    });

    if (existingLeague) {
      return res.status(400).json({
        message: "League already exists for this season",
      });
    }

    let logoUrl = "";

    // 🔥 Upload to Cloudinary if logo exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "kickoff_leagues",
      });

      logoUrl = result.secure_url;

      // 🧹 Delete temp file after upload
      fs.unlinkSync(req.file.path);
    }

    const league = await League.create({
      name: trimmedName,
      season: trimmedSeason,
      format: format || "round-robin",
      numberOfTeams,
      description: description || "",
      logo: logoUrl,
      organizationId: req.user.id,
    });

    res.status(201).json({
      message: "League created successfully",
      league,
    });

  } catch (error) {
    console.error("CREATE LEAGUE ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ===============================
// Get Leagues for Organization
// ===============================
exports.getLeagues = async (req, res) => {
  try {
    const leagues = await League.find({
      organizationId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: leagues.length,
      leagues,
    });

  } catch (error) {
    console.error("GET LEAGUES ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};