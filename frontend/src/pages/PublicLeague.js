import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../utils/api";

const PublicLeague = () => {

  const { leagueId } =
    useParams();

  const navigate =
    useNavigate();

  const [league, setLeague] =
    useState(null);

  const [matches, setMatches] =
    useState([]);

    const liveMatches =
    matches
      .filter(
        (match) =>
          match.status ===
          "live" ||
          match.status ===
          "half-time"
      )
      .sort(
        (a, b) =>
          new Date(
            b.updatedAt
          ) -
          new Date(
            a.updatedAt
          )
      );

      const getMatchMinute =
  (match) => {

    try {

      if (
        match.status !==
        "live"
      ) {

        return 0;

      }

      let startTime;

      // SECOND HALF
      if (
        match.currentHalf ===
          2 &&
        match.secondHalfStart
      ) {

        startTime =
          new Date(
            match.secondHalfStart
          );

        const mins =
          Math.floor(
            (
              Date.now() -
              startTime.getTime()
            ) /
              60000
          );

        return 45 + mins;

      }

      // FIRST HALF
      startTime =
        new Date(
          match.firstHalfStart
        );

      return Math.floor(
        (
          Date.now() -
          startTime.getTime()
        ) /
          60000
      );

    } catch {

      return 0;

    }
  };

  const [standings, setStandings] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("matches");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!leagueId) {

      setError(
        "League not found"
      );

      setLoading(false);

      return;

    }

    fetchLeagueData();

    // AUTO REFRESH LIVE SCORES
    const interval =
      setInterval(() => {

        fetchLeagueData();

      }, 15000);

    return () =>
      clearInterval(interval);

  }, [leagueId]);

  /* =========================
     FETCH DATA
  ========================= */

  const fetchLeagueData =
    async () => {

      try {

        setLoading(true);

        const [
          leagueRes,
          matchesRes,
          standingsRes,
        ] = await Promise.all([

          API.get(
            `/public/leagues/${leagueId}`
          ),

          API.get(
            `/public/leagues/${leagueId}/matches`
          ),

          API.get(
            `/public/leagues/${leagueId}/standings`
          ),

        ]);

        setLeague(
          leagueRes.data.league
        );

        const sortedMatches =
  (
    matchesRes.data
      .matches || []
  ).sort((a, b) => {

    /* LIVE MATCHES FIRST */
    if (
      a.status === "live" &&
      b.status !== "live"
    ) {

      return -1;

    }

    if (
      a.status !== "live" &&
      b.status === "live"
    ) {

      return 1;

    }

    /* ROUND ORDER */
    if (
      a.round !==
      b.round
    ) {

      return (
        a.round -
        b.round
      );

    }

    /* DATE ORDER */
    return (
      new Date(
        a.matchDate || 0
      ) -
      new Date(
        b.matchDate || 0
      )
    );

  });

setMatches(
  sortedMatches
);

        const sortedTeams =
          (
            standingsRes.data
              .teams || []
          ).sort((a, b) => {

            if (
              b.points !==
              a.points
            ) {

              return (
                b.points -
                a.points
              );

            }

            const gdA =
              (a.goalsFor || 0) -
              (a.goalsAgainst || 0);

            const gdB =
              (b.goalsFor || 0) -
              (b.goalsAgainst || 0);

            return gdB - gdA;

          });

        setStandings(
          sortedTeams
        );

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data
            ?.message ||
            "Failed to load league"
        );

      } finally {

        setLoading(false);

      }
    };

  if (loading) {

    return (

      <div style={styles.loadingPage}>
        Loading league...
      </div>

    );
  }

  if (!league) {

    return (

      <div style={styles.loadingPage}>
        League not found
      </div>

    );
  }

  return (

    <div style={styles.page}>

      {/* TOPBAR */}
      <div style={styles.topbar}>

        <div
          style={styles.brand}
          onClick={() =>
            navigate("/")
          }
        >
          ⚽ Kickoff
        </div>

        <button
          style={styles.backBtn}
          onClick={() =>
            navigate("/leagues")
          }
        >
          ← Back
        </button>

      </div>

      {/* HERO */}
      <div style={styles.hero}>

        <div style={styles.overlay}></div>

        <div style={styles.heroContent}>

          {league.logo ? (

            <img
              src={league.logo}
              alt="logo"
              style={styles.heroLogo}
            />

          ) : (

            <div style={styles.logoPlaceholder}>
              {league.name?.charAt(0)}
            </div>

          )}

          <h1 style={styles.title}>
            {league.name}
          </h1>

          <div style={styles.metaRow}>

            <div style={styles.metaCard}>
              {league.season}
            </div>

            <div style={styles.metaCard}>
              {league.format
                ?.replaceAll(
                  "_",
                  " "
                )}
            </div>

            <div style={styles.metaCard}>
              {standings.length} Teams
            </div>

          </div>

        </div>

      </div>

      {/* ERROR */}
      {error && (

        <div style={styles.error}>
          {error}
        </div>

      )}

      {/* LIVE MATCHES */}
{liveMatches.length > 0 && (

<div style={styles.liveSection}>

  <div style={styles.liveHeader}>
     Live Matches
  </div>

  <div style={styles.liveGrid}>

    {liveMatches.map((match) => (

      <div
        key={match._id}
        style={styles.liveCard}
      >

<div style={styles.liveTop}>

<div style={styles.liveBadge}>
  {match.status?.toUpperCase()}
</div>

<div style={styles.liveTimer}>
  {getMatchMinute(match)}'
</div>

</div>

        <div style={styles.liveTeams}>

          {/* HOME */}
          <div style={styles.liveTeamBox}>

            {match.homeTeam
              ?.logo ? (

              <img
                src={
                  match.homeTeam
                    .logo
                }
                alt=""
                style={
                  styles.liveLogo
                }
              />

            ) : (

              <div style={
                styles.livePlaceholder
              }>
                {match.homeTeam?.name?.charAt(
                  0
                )}
              </div>

            )}

            <div style={styles.liveTeam}>
              {
                match.homeTeam
                  ?.name
              }
            </div>

          </div>

          {/* SCORE */}
          <div style={styles.liveScore}>
            {
              match.homeScore
            } - {
              match.awayScore
            }
          </div>

          {/* AWAY */}
          <div style={styles.liveTeamBox}>

            {match.awayTeam
              ?.logo ? (

              <img
                src={
                  match.awayTeam
                    .logo
                }
                alt=""
                style={
                  styles.liveLogo
                }
              />

            ) : (

              <div style={
                styles.livePlaceholder
              }>
                {match.awayTeam?.name?.charAt(
                  0
                )}
              </div>

            )}

            <div style={styles.liveTeam}>
              {
                match.awayTeam
                  ?.name
              }
            </div>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

)}
      {/* TABS */}
      <div style={styles.tabs}>

        <button
          style={{
            ...styles.tabBtn,
            background:
              activeTab ===
              "matches"
                ? "linear-gradient(to right, #22c55e, #16a34a)"
                : "#1e293b",
          }}
          onClick={() =>
            setActiveTab(
              "matches"
            )
          }
        >
          Fixtures
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background:
              activeTab ===
              "standings"
                ? "linear-gradient(to right, #22c55e, #16a34a)"
                : "#1e293b",
          }}
          onClick={() =>
            setActiveTab(
              "standings"
            )
          }
        >
          Standings
        </button>

      </div>

      {/* MATCHES */}
      {activeTab ===
        "matches" && (

        <div style={styles.section}>

          {matches.length ===
          0 ? (

            <div style={styles.empty}>
              No matches available
            </div>

          ) : (

            matches.map(
              (match) => (

                <div
                  key={
                    match._id
                  }
                  style={
                    styles.matchCard
                  }
                >

                  <div style={styles.matchTop}>

                    <span style={styles.round}>
                      Round {match.round}
                    </span>

                    <span
                      style={{
                        ...styles.status,
                        background:
                          match.status ===
                          "live"
                            ? "#dc2626"
                            : "#334155",
                      }}
                    >
                      {match.status}
                    </span>

                  </div>

                  <div style={styles.matchCenter}>

                    {/* HOME */}
                    <div style={styles.team}>

                      {match.homeTeam
                        ?.logo ? (

                        <img
                          src={
                            match
                              .homeTeam
                              .logo
                          }
                          alt=""
                          style={
                            styles.teamLogo
                          }
                        />

                      ) : (

                        <div style={
                          styles.teamPlaceholder
                        }>
                          {match.homeTeam?.name?.charAt(
                            0
                          )}
                        </div>

                      )}

                      <span>
                        {
                          match
                            .homeTeam
                            ?.name
                        }
                      </span>

                    </div>

                    {/* SCORE */}
                    <div style={styles.scoreBox}>

                      <div style={styles.score}>
                        {
                          match.homeScore
                        } - {
                          match.awayScore
                        }
                      </div>

                      <div style={styles.matchDate}>
                        {match.matchDate

                          ? new Date(
                              match.matchDate
                            ).toLocaleString()

                          : "Not Scheduled"}
                      </div>

                    </div>

                    {/* AWAY */}
                    <div style={styles.team}>

                      {match.awayTeam
                        ?.logo ? (

                        <img
                          src={
                            match
                              .awayTeam
                              .logo
                          }
                          alt=""
                          style={
                            styles.teamLogo
                          }
                        />

                      ) : (

                        <div style={
                          styles.teamPlaceholder
                        }>
                          {match.awayTeam?.name?.charAt(
                            0
                          )}
                        </div>

                      )}

                      <span>
                        {
                          match
                            .awayTeam
                            ?.name
                        }
                      </span>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      )}

      

      {/* STANDINGS */}
      {activeTab ===
        "standings" && (

        <div style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>
              Team
            </div>

            <div>P</div>

            <div>W</div>

            <div>D</div>

            <div>L</div>

            <div>PTS</div>

          </div>

          {standings.map(
            (
              team,
              index
            ) => (

              <div
                key={team._id}
                style={
                  styles.tableRow
                }
              >

                <div style={styles.teamRow}>

                  <div style={styles.position}>
                    {index + 1}
                  </div>

                  {team.logo ? (

                    <img
                      src={
                        team.logo
                      }
                      alt=""
                      style={
                        styles.smallLogo
                      }
                    />

                  ) : (

                    <div style={
                      styles.smallPlaceholder
                    }>
                      {team.name?.charAt(
                        0
                      )}
                    </div>

                  )}

                  <span>
                    {team.name}
                  </span>

                </div>

                <div>
                  {team.played || 0}
                </div>

                <div>
                  {team.wins || 0}
                </div>

                <div>
                  {team.draws || 0}
                </div>

                <div>
                  {team.losses || 0}
                </div>

                <div style={styles.points}>
                  {team.points || 0}
                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    fontFamily:
      "Poppins, sans-serif",
    paddingBottom: "60px",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    color: "white",
    fontSize: "20px",
  },

  topbar: {
    height: "72px",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "0 40px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },

  brand: {
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer",
  },

  backBtn: {
    background: "#1e293b",
    border: "none",
    color: "white",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },

  hero: {
    position: "relative",
    padding: "100px 20px 70px",
    textAlign: "center",
    overflow: "hidden",
    background:
      "linear-gradient(to right, #0f172a, #111827, #14532d)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top right, rgba(34,197,94,0.25), transparent 40%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  heroLogo: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "24px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.35)",
  },

  logoPlaceholder: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #22c55e, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: "46px",
    fontWeight: "700",
    margin:
      "0 auto 24px",
    color: "white",
    boxShadow:
      "0 20px 40px rgba(22,163,74,0.35)",
  },

  title: {
    fontSize: "58px",
    marginBottom: "18px",
    fontWeight: "800",
  },

  metaRow: {
    display: "flex",
    justifyContent:
      "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  metaCard: {
    background:
      "rgba(255,255,255,0.08)",
    padding: "12px 20px",
    borderRadius: "999px",
    backdropFilter: "blur(10px)",
    textTransform:
      "capitalize",
  },

  tabs: {
    display: "flex",
    gap: "18px",
    padding: "40px 80px 20px",
  },

  tabBtn: {
    border: "none",
    color: "white",
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },

  section: {
    padding: "0 80px",
  },

  matchCard: {
    background:
      "linear-gradient(to right, #111827, #1e293b)",
    padding: "30px",
    borderRadius: "26px",
    marginBottom: "24px",
    border:
      "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.28)",
  },

  matchTop: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "24px",
  },

  round: {
    color: "#cbd5e1",
  },

  status: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    textTransform:
      "capitalize",
    color: "white",
    fontWeight: "600",
  },

  matchCenter: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
  },

  team: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    textAlign: "center",
    fontWeight: "600",
  },

  teamLogo: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow:
      "0 12px 25px rgba(0,0,0,0.25)",
  },

  teamPlaceholder: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #22c55e, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: "30px",
    fontWeight: "700",
    color: "white",
  },

  scoreBox: {
    textAlign: "center",
    minWidth: "220px",
  },

  score: {
    fontSize: "52px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  matchDate: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  tableCard: {
    margin:
      "0 80px",
    background:
      "linear-gradient(to right, #111827, #1e293b)",
    borderRadius: "28px",
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.28)",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "3fr repeat(5, 1fr)",
    padding: "22px",
    background: "#0f172a",
    fontWeight: "700",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "3fr repeat(5, 1fr)",
    padding: "22px",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
    alignItems: "center",
  },

  teamRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  position: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background:
      "rgba(34,197,94,0.15)",
    color: "#4ade80",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: "14px",
    fontWeight: "700",
  },

  smallLogo: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  smallPlaceholder: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #22c55e, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontWeight: "700",
    color: "white",
  },

  points: {
    fontWeight: "800",
    color: "#4ade80",
  },

  error: {
    background: "#7f1d1d",
    color: "white",
    margin: "30px 80px",
    padding: "16px",
    borderRadius: "16px",
  },

  empty: {
    background:
      "linear-gradient(to right, #111827, #1e293b)",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    color: "#cbd5e1",
    border:
      "1px solid rgba(255,255,255,0.06)",
  },

  liveSection: {
    padding: "30px 80px 10px",
  },

  liveHeader: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "22px",
  },

  liveGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
  },

  liveCard: {
    background:
      "linear-gradient(to right, #166534, #15803d)",
    borderRadius: "24px",
    padding: "26px",
    boxShadow:
      "0 15px 35px rgba(127,29,29,0.35)",
    position: "relative",
    overflow: "hidden",
  },

  liveSection: {
    padding: "30px 80px 10px",
  },
  
  liveHeader: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  
  liveGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
  },
  
  
  liveBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "white",
    color: "#991b1b",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  
  liveTeams: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "18px",
    marginTop: "16px",
  },
  
  liveTeamBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  
  liveLogo: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)",
  },
  
  livePlaceholder: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #22c55e, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
  },
  
  liveTeam: {
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
  },
  
  liveScore: {
    fontSize: "48px",
    fontWeight: "800",
    minWidth: "120px",
    textAlign: "center",
  },

  liveBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "white",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  liveTeams: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "16px",
    marginTop: "20px",
  },

  liveTeam: {
    flex: 1,
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
  },

  liveScore: {
    fontSize: "42px",
    fontWeight: "800",
    minWidth: "120px",
    textAlign: "center",
  },

};

export default PublicLeague;

