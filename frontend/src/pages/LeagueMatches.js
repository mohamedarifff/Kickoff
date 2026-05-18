import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueMatches = () => {

  const { leagueId } =
    useParams();

  const navigate =
    useNavigate();

  const [league, setLeague] =
    useState(null);

  const [matches, setMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const token =
      localStorage.getItem(
        "orgToken"
      );

    if (!token) {

      navigate("/org/login");

      return;

    }

    fetchLeague();

    fetchMatches();

  }, [leagueId]);

  /* =========================
     FETCH LEAGUE
  ========================= */

  const fetchLeague =
    async () => {

      try {

        const res =
          await API.get(
            "/leagues"
          );

        const foundLeague =
          res.data.leagues.find(
            (l) =>
              l._id ===
              leagueId
          );

        if (!foundLeague) {

          setError(
            "League not found"
          );

          return;

        }

        setLeague(foundLeague);

      } catch (error) {

        console.log(
          "League fetch failed"
        );

        setError(

          error.response?.data
            ?.message ||

          "Failed to load league"

        );

      }
    };

  /* =========================
     FETCH MATCHES
  ========================= */

  const fetchMatches =
    async () => {

      try {

        const res =
          await API.get(
            `/matches/league/${leagueId}`
          );

        const sorted =
          (res.data.matches || [])
            .sort((a, b) => {

              if (
                a.round !==
                b.round
              ) {

                return (
                  a.round -
                  b.round
                );

              }

              return (
                (a.homeTeam?.name || "")
                  .localeCompare(
                    b.homeTeam?.name || ""
                  )
              );

            });

        setMatches(sorted);

      } catch (error) {

        console.log(
          "Match fetch failed"
        );

        setError(

          error.response?.data
            ?.message ||

          "Failed to load matches"

        );

      } finally {

        setLoading(false);

      }
    };

  /* =========================
     STATUS STYLES
  ========================= */

  const getStatusStyle = (
    status
  ) => {

    if (status === "live") {

      return {
        background:
          "#fee2e2",
        color: "#b91c1c",
      };

    }

    if (
      status ===
      "completed"
    ) {

      return {
        background:
          "#dcfce7",
        color: "#166534",
      };

    }

    if (
      status ===
      "half-time"
    ) {

      return {
        background:
          "#fef3c7",
        color: "#92400e",
      };

    }

    if (
      status === "paused"
    ) {

      return {
        background:
          "#e0e7ff",
        color: "#4338ca",
      };

    }

    return {
      background:
        "#e2e8f0",
      color: "#334155",
    };

  };

  if (loading)
    return null;

  if (!league)
    return null;

  const liveMatches =
    matches.filter(
      (m) =>
        m.status ===
        "live"
    ).length;

  const completedMatches =
    matches.filter(
      (m) =>
        m.status ===
        "completed"
    ).length;

  const upcomingMatches =
    matches.filter(
      (m) =>
        m.status ===
        "scheduled"
    ).length;

  return (
    <OrgLayout title="Match Center">

      {error && (

        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "16px",
          borderRadius: "16px",
          marginBottom: "24px",
          fontWeight: "600",
        }}>
          {error}
        </div>

      )}

      {/* HERO */}
      <div style={styles.hero}>

        <div>

          <div style={styles.heroTitle}>
            {league.name}
          </div>

          <div style={styles.heroMeta}>
            Match Operations Center
          </div>

        </div>

        <div style={styles.heroBadge}>
          {matches.length} Matches
        </div>

      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <StatCard
          label="Total Matches"
          value={
            matches.length
          }
        />

        <StatCard
          label="Live"
          value={
            liveMatches
          }
        />

        <StatCard
          label="Completed"
          value={
            completedMatches
          }
        />

        <StatCard
          label="Upcoming"
          value={
            upcomingMatches
          }
        />

      </div>

      {/* MATCHES */}
      <div style={styles.sectionTitle}>
        Match Operations
      </div>

      {matches.length ===
      0 ? (

        <div style={styles.empty}>

          No matches available

        </div>

      ) : (

        <div style={styles.grid}>

          {matches.map(
            (match) => (

              <div
                key={
                  match._id
                }
                style={
                  styles.card
                }
              >

                {/* STATUS */}
                <div
                  style={{
                    ...styles.status,
                    ...getStatusStyle(
                      match.status
                    ),
                  }}
                >
                  {match.status
                    ?.replaceAll(
                      "_",
                      " "
                    )}
                </div>

                {/* TEAMS */}
                <div
                  style={
                    styles.teamSection
                  }
                >

                  {/* HOME */}
                  <Team
                    team={
                      match.homeTeam
                    }
                  />

                  {/* CENTER */}
                  <div
                    style={
                      styles.center
                    }
                  >

                    <div
                      style={
                        styles.score
                      }
                    >
                      {
                        match.homeScore
                      }{" "}
                      -{" "}
                      {
                        match.awayScore
                      }
                    </div>

                    <div
                      style={
                        styles.date
                      }
                    >
                      {match.matchDate
                        ? new Date(
                            match.matchDate
                          ).toLocaleString()
                        : "Not Scheduled"}
                    </div>

                  </div>

                  {/* AWAY */}
                  <Team
                    team={
                      match.awayTeam
                    }
                  />

                </div>

                {/* ACTION */}
                <button
                  style={
                    styles.controlBtn
                  }
                  onClick={() =>
                    navigate(
                      `/org/matches/${match._id}`
                    )
                  }
                >
                  Open Match Control
                </button>

              </div>

            )
          )}

        </div>

      )}

    </OrgLayout>
  );
};

/* =========================
   TEAM
========================= */

const Team = ({
  team,
}) => (

  <div style={styles.team}>

    {team?.logo ? (

      <img
        src={
          team.logo
        }
        alt="logo"
        style={styles.logo}
      />

    ) : (

      <div
        style={
          styles.placeholder
        }
      >
        {team?.name?.charAt(
          0
        )}
      </div>

    )}

    <span
      style={
        styles.teamName
      }
    >
      {team?.name}
    </span>

  </div>
);

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  label,
  value,
}) => (

  <div style={styles.statCard}>

    <div
      style={
        styles.statValue
      }
    >
      {value}
    </div>

    <div
      style={
        styles.statLabel
      }
    >
      {label}
    </div>

  </div>
);

/* =========================
   STYLES
========================= */

const styles = {

  hero: {
    background:
      "linear-gradient(135deg, #0f172a, #1e293b)",
    borderRadius: "32px",
    padding: "40px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "32px",
    color: "white",
    boxShadow:
      "0 20px 45px rgba(15,23,42,0.18)",
  },

  heroTitle: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  heroMeta: {
    color: "#cbd5e1",
  },

  heroBadge: {
    padding: "12px 22px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.14)",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "36px",
  },

  statCard: {
    background: "white",
    padding: "28px",
    borderRadius: "26px",
    boxShadow:
      "0 14px 35px rgba(15,23,42,0.06)",
  },

  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },

  statLabel: {
    color: "#64748b",
  },

  sectionTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "22px",
    color: "#0f172a",
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "28px",
    textAlign: "center",
    boxShadow:
      "0 14px 35px rgba(15,23,42,0.06)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "28px",
  },

  card: {
    background: "white",
    borderRadius: "30px",
    padding: "30px",
    boxShadow:
      "0 16px 40px rgba(15,23,42,0.06)",
    position: "relative",
  },

  status: {
    position: "absolute",
    top: "24px",
    right: "24px",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform:
      "capitalize",
  },

  teamSection: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: "24px",
    marginBottom: "30px",
  },

  team: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "35%",
    textAlign: "center",
    gap: "14px",
  },

  logo: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    objectFit: "cover",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },

  placeholder: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    color: "white",
    fontWeight: "800",
    fontSize: "28px",
  },

  teamName: {
    fontWeight: "700",
    color: "#0f172a",
  },

  center: {
    textAlign: "center",
  },

  score: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },

  date: {
    color: "#64748b",
    fontSize: "14px",
  },

  controlBtn: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.25)",
  },

};

export default LeagueMatches;