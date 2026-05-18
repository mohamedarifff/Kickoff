import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueFixtures = () => {

  const { leagueId } =
    useParams();

  const navigate =
    useNavigate();

  const [league, setLeague] =
    useState(null);

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "orgToken"
      );

    if (!token) {

      navigate("/org/login");

      return;

    }

    fetchLeague(token);

    fetchMatches(token);

  }, [leagueId]);

  const formatLabel = (
    value
  ) => {

    if (!value) return "";

    return value
      .replace(/[_-]/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );

  };

  const fetchLeague =
    async (token) => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/leagues",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const found =
          res.data.leagues.find(
            (l) =>
              l._id ===
              leagueId
          );

        setLeague(found);

      } catch (error) {

        console.error(error);

      }
    };

  const fetchMatches =
    async (token) => {

      try {

        const res =
          await axios.get(
            `http://localhost:5000/api/matches/league/${leagueId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const sorted =
          res.data.matches.sort(
            (a, b) => {

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
                a.homeTeam.name.localeCompare(
                  b.homeTeam.name
                )
              );

            }
          );

        setMatches(sorted);

      } catch (error) {

        console.error(error);

      }
    };

  const generateFixtures =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "orgToken"
          );

        await axios.post(
          `http://localhost:5000/api/matches/generate/${leagueId}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        await fetchLeague(
          token
        );

        await fetchMatches(
          token
        );

      } catch (error) {

        console.error(error);

      }
    };

  const scheduleMatch =
    async (
      matchId,
      date,
      time
    ) => {

      if (!date || !time)
        return;

      try {

        const token =
          localStorage.getItem(
            "orgToken"
          );

        const combinedDate =
          new Date(
            `${date}T${time}:00`
          );

        await axios.put(
          `http://localhost:5000/api/matches/schedule/${matchId}`,
          {
            matchDate:
              combinedDate.toISOString(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchMatches(token);

      } catch (error) {

        console.error(error);

      }
    };

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

  const scheduledMatches =
    matches.filter(
      (m) =>
        m.matchDate
    ).length;

  return (
    <OrgLayout title="Fixtures">

      {/* HERO */}
      <div style={styles.hero}>

        <div>

          <div style={styles.heroTitle}>
            {league.name}
          </div>

          <div style={styles.heroMeta}>
            {league.season}
            {" • "}
            {formatLabel(
              league.format
            )}
          </div>

        </div>

        {league.status ===
        "draft" ? (

          <button
            style={
              styles.generateBtn
            }
            onClick={
              generateFixtures
            }
          >
            Generate Fixtures
          </button>

        ) : (

          <div
            style={
              styles.generatedBadge
            }
          >
            Fixtures Generated
          </div>

        )}

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
          label="Scheduled"
          value={
            scheduledMatches
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

      </div>

      {/* FIXTURES */}
      <div style={styles.sectionTitle}>
        Match Fixtures
      </div>

      <div style={styles.grid}>

        {matches.map(
          (match) => (

            <div
              key={
                match._id
              }
              style={
                styles.matchCard
              }
            >

              {/* ROUND */}
              <div
                style={
                  styles.roundBadge
                }
              >
                Round{" "}
                {
                  match.round
                }
              </div>

              {/* TEAMS */}
              <div
                style={
                  styles.teams
                }
              >

                <Team
                  team={
                    match.homeTeam
                  }
                />

                <div
                  style={
                    styles.vs
                  }
                >
                  VS
                </div>

                <Team
                  team={
                    match.awayTeam
                  }
                />

              </div>

              {/* STATUS */}
              <div
                style={
                  styles.statusRow
                }
              >

                <span
                  style={
                    styles.statusLabel
                  }
                >
                  Status
                </span>

                <span
                  style={{
                    ...styles.status,
                    background:
                      match.status ===
                      "live"
                        ? "#fee2e2"
                        : match.status ===
                          "completed"
                        ? "#dbeafe"
                        : "#dcfce7",
                    color:
                      match.status ===
                      "live"
                        ? "#991b1b"
                        : match.status ===
                          "completed"
                        ? "#1d4ed8"
                        : "#166534",
                  }}
                >
                  {
                    match.status
                  }
                </span>

              </div>

              {/* DATE */}
              {match.matchDate ? (

                <div
                  style={
                    styles.date
                  }
                >
                  {new Date(
                    match.matchDate
                  ).toLocaleString()}
                </div>

              ) : (

                <ScheduleBox
                  matchId={
                    match._id
                  }
                  scheduleMatch={
                    scheduleMatch
                  }
                />

              )}

              {/* CONTROL */}
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
                Open Match
              </button>

            </div>

          )
        )}

      </div>

    </OrgLayout>
  );
};

/* ======================
   TEAM
====================== */

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
        style={
          styles.logo
        }
      />

    ) : (

      <div
        style={
          styles.logoPlaceholder
        }
      >
        {team?.name?.charAt(
          0
        )}
      </div>

    )}

    <span>
      {team?.name}
    </span>

  </div>
);

/* ======================
   SCHEDULE BOX
====================== */

const ScheduleBox = ({
  matchId,
  scheduleMatch,
}) => {

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  return (
    <div style={styles.scheduleCard}>

      <div style={styles.scheduleTitle}>
        Schedule Match
      </div>

      <div style={styles.scheduleInputs}>

        {/* DATE */}
        <div style={styles.inputGroup}>

          <label style={styles.inputLabel}>
            Match Date
          </label>

          <input
            type="date"
            style={styles.modernInput}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />

        </div>

        {/* TIME */}
        <div style={styles.inputGroup}>

          <label style={styles.inputLabel}>
            Kickoff Time
          </label>

          <input
            type="time"
            style={styles.modernInput}
            onChange={(e) =>
              setTime(
                e.target.value
              )
            }
          />

        </div>

      </div>

      <button
        style={styles.saveBtn}
        onClick={() =>
          scheduleMatch(
            matchId,
            date,
            time
          )
        }
      >
        Save Schedule
      </button>

    </div>
  );
};

/* ======================
   STAT CARD
====================== */

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

/* ======================
   STYLES
====================== */

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
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  heroMeta: {
    color: "#cbd5e1",
    fontSize: "15px",
  },

  generateBtn: {
    padding: "16px 24px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.22)",
  },

  generatedBadge: {
    padding: "12px 20px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    color: "white",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },

  statCard: {
    background: "white",
    padding: "30px",
    borderRadius: "28px",
    boxShadow:
      "0 14px 35px rgba(15,23,42,0.06)",
  },

  statValue: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },

  statLabel: {
    color: "#64748b",
  },

  sectionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "26px",
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "30px",
  },

  matchCard: {
    background: "white",
    borderRadius: "32px",
    padding: "30px",
    boxShadow:
      "0 16px 40px rgba(15,23,42,0.06)",
    border:
      "1px solid #f1f5f9",
  },

  roundBadge: {
    display: "inline-block",
    padding: "7px 16px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "24px",
  },

  teams: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: "30px",
  },

  team: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    width: "40%",
    textAlign: "center",
    fontWeight: "700",
    color: "#0f172a",
  },

  logo: {
    width: "76px",
    height: "76px",
    borderRadius: "22px",
    objectFit: "cover",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },

  logoPlaceholder: {
    width: "76px",
    height: "76px",
    borderRadius: "22px",
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

  vs: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: "14px",
  },

  statusRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  statusLabel: {
    color: "#64748b",
    fontSize: "14px",
  },

  status: {
    padding: "7px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform:
      "capitalize",
  },

  date: {
    marginBottom: "22px",
    color: "#0f172a",
    fontWeight: "600",
    fontSize: "14px",
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "16px",
  },

  scheduleCard: {
    background: "#f8fafc",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "22px",
    border: "1px solid #e2e8f0",
  },

  scheduleTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "18px",
  },

  scheduleInputs: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "14px",
    marginBottom: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  inputLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "600",
  },

  modernInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    background: "white",
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily:
      "Poppins, sans-serif",
  },

  saveBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.18)",
  },

  controlBtn: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

};

export default LeagueFixtures;