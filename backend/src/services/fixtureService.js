const League = require(
  "../models/League"
);

const Team = require(
  "../models/Team"
);

const Match = require(
  "../models/Match"
);

/* =========================================
   ROUND ROBIN GENERATOR
========================================= */

const roundRobinGenerator =
  async (league, teams) => {

    if (
      teams.length < 2
    ) {

      throw new Error(
        "Not enough teams"
      );

    }

    let teamList = [
      ...teams,
    ];

    /* HANDLE ODD TEAMS */

    if (
      teamList.length % 2 !==
      0
    ) {

      teamList.push(null);

    }

    const totalRounds =
      teamList.length - 1;

    const matchesPerRound =
      teamList.length / 2;

    const isDouble =
      league.roundRobinType ===
      "double";

    const fixtures = [];

    for (
      let round = 0;
      round < totalRounds;
      round++
    ) {

      for (
        let match = 0;
        match <
        matchesPerRound;
        match++
      ) {

        const home =
          teamList[match];

        const away =
          teamList[
            teamList.length -
              1 -
              match
          ];

        if (
          home &&
          away
        ) {

          fixtures.push({

            leagueId:
              league._id,

            homeTeam:
              home._id,

            awayTeam:
              away._id,

            round:
              round + 1,

            stage:
              "league",

            status:
              "pending",

            homeScore: 0,

            awayScore: 0,

          });

          /* DOUBLE ROUND ROBIN */

          if (isDouble) {

            fixtures.push({

              leagueId:
                league._id,

              homeTeam:
                away._id,

              awayTeam:
                home._id,

              round:
                round +
                1 +
                totalRounds,

              stage:
                "league",

              status:
                "pending",

              homeScore: 0,

              awayScore: 0,

            });
          }
        }
      }

      /* ROTATE TEAMS */

      const fixed =
        teamList.shift();

      const last =
        teamList.pop();

      teamList.unshift(
        fixed
      );

      teamList.splice(
        1,
        0,
        last
      );
    }

    await Match.insertMany(
      fixtures
    );

    league.status =
      "fixtures_generated";

    await league.save();

    return {

      totalMatches:
        fixtures.length,

    };
  };

/* =========================================
   KNOCKOUT GENERATOR
========================================= */

const knockoutGenerator =
  async (league, teams) => {

    if (
      teams.length < 2
    ) {

      throw new Error(
        "Not enough teams"
      );

    }

    let teamList = [
      ...teams,
    ];

    /* MAKE POWER OF 2 */

    const nextPowerOf2 =
      Math.pow(
        2,
        Math.ceil(
          Math.log2(
            teamList.length
          )
        )
      );

    while (
      teamList.length <
      nextPowerOf2
    ) {

      teamList.push(null);

    }

    const fixtures = [];

    for (
      let i = 0;
      i < teamList.length;
      i += 2
    ) {

      if (
        teamList[i] &&
        teamList[i + 1]
      ) {

        fixtures.push({

          leagueId:
            league._id,

          homeTeam:
            teamList[i]._id,

          awayTeam:
            teamList[
              i + 1
            ]._id,

          round: 1,

          stage:
            "quarterfinal",

          status:
            "pending",

          homeScore: 0,

          awayScore: 0,

        });
      }
    }

    await Match.insertMany(
      fixtures
    );

    league.status =
      "fixtures_generated";

    await league.save();

    return {

      totalMatches:
        fixtures.length,

    };
  };

/* =========================================
   GROUP + KNOCKOUT GENERATOR
========================================= */

const groupKnockoutGenerator =
  async (league, teams) => {

    const groupCount =
      league.groups || 2;

    if (
      teams.length <
      groupCount * 2
    ) {

      throw new Error(
        "Not enough teams for group stage"
      );

    }

    const groups = [];

    for (
      let i = 0;
      i < groupCount;
      i++
    ) {

      groups.push([]);

    }

    /* DISTRIBUTE TEAMS */

    teams.forEach(
      (team, index) => {

        groups[
          index % groupCount
        ].push(team);

      }
    );

    const fixtures = [];

    /* ROUND ROBIN INSIDE GROUPS */

    for (
      let g = 0;
      g < groups.length;
      g++
    ) {

      const groupTeams =
        groups[g];

      for (
        let i = 0;
        i < groupTeams.length;
        i++
      ) {

        for (
          let j = i + 1;
          j <
          groupTeams.length;
          j++
        ) {

          fixtures.push({

            leagueId:
              league._id,

            homeTeam:
              groupTeams[i]
                ._id,

            awayTeam:
              groupTeams[j]
                ._id,

            round:
              g + 1,

            stage:
              `group_${
                g + 1
              }`,

            status:
              "pending",

            homeScore: 0,

            awayScore: 0,

          });
        }
      }
    }

    await Match.insertMany(
      fixtures
    );

    league.status =
      "fixtures_generated";

    await league.save();

    return {

      totalMatches:
        fixtures.length,

    };
  };

/* =========================================
   MAIN GENERATOR
========================================= */

exports.generateFixtures =
  async (leagueId) => {

    const league =
      await League.findById(
        leagueId
      );

    if (!league) {

      throw new Error(
        "League not found"
      );

    }

    const teams =
      await Team.find({
        leagueId,
      });

    const existingMatches =
      await Match.find({
        leagueId,
      });

    if (
      existingMatches.length >
      0
    ) {

      throw new Error(
        "Fixtures already generated"
      );

    }

    if (
      league.format ===
      "round_robin"
    ) {

      return await roundRobinGenerator(
        league,
        teams
      );

    }

    if (
      league.format ===
      "knockout"
    ) {

      return await knockoutGenerator(
        league,
        teams
      );

    }

    if (
      league.format ===
      "group_knockout"
    ) {

      return await groupKnockoutGenerator(
        league,
        teams
      );

    }

    throw new Error(
      "Invalid league format"
    );
  };