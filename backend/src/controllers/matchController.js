const fixtureService = require("../services/fixtureService");
const Match = require("../models/Match");
const League = require("../models/League");
const Team = require("../models/Team");

exports.generateFixtures = async (req, res) => {
  try {
    const { leagueId } = req.params;

    const result = await fixtureService.generateFixtures(leagueId);

    res.status(201).json({
      message: "Fixtures generated successfully",
      ...result,
    });

  } catch (error) {
    console.error("FIXTURE ERROR:", error.message);

    res.status(400).json({
      message: error.message || "Server error",
    });
  }
};

exports.getMatchesByLeague = async (req, res) => {
    try {
      const { leagueId } = req.params;
  
      const matches = await Match.find({ leagueId })
        .populate("homeTeam")
        .populate("awayTeam")
        .sort({ round: 1 });
  
      res.status(200).json({ matches });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.scheduleMatch = async (req, res) => {
    try {
      const { matchId } = req.params;
      const { matchDate } = req.body;
  
      console.log("Received date:", matchDate); // 🔥 add this debug
  
      if (!matchDate) {
        return res.status(400).json({ message: "Match date required" });
      }
  
      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        {
          matchDate: new Date(matchDate),   // 🔥 MUST wrap in Date()
          status: "scheduled",
        },
        { new: true }
      );
    
  
      console.log("Updated match:", updatedMatch); // 🔥 debug
  
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
  
      res.status(200).json({
        message: "Match scheduled successfully",
        match: updatedMatch,
      });
  
    } catch (error) {
      console.error("Schedule Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };