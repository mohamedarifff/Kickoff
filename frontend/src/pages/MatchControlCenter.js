import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import OrgLayout from "../components/layout/OrgLayout";

const MatchControlCenter = () => {

  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchMatches(token);

  }, [navigate]);

  const fetchMatches = async (token) => {

    try {

      const leagueRes = await axios.get(
        "http://localhost:5000/api/leagues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const leagues =
        leagueRes.data.leagues || [];

      let allMatches = [];

      for (const league of leagues) {

        try {

          const matchRes = await axios.get(
            `http://localhost:5000/api/matches/league/${league._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const matchesWithLeague =
            matchRes.data.matches.map(
              (match) => ({
                ...match,
                leagueName: league.name,
              })
            );

          allMatches.push(
            ...matchesWithLeague
          );

        } catch (error) {

          console.error(
            "Failed loading league matches"
          );

        }
      }

      setMatches(allMatches);

    } catch (error) {

      console.error(
        "Failed fetching matches"
      );

    } finally {

      setLoading(false);

    }
  };

  const scheduledMatches =
    matches.filter(
      (m) => m.status === "scheduled"
    ).length;

  const liveMatches =
    matches.filter(
      (m) => m.status === "live"
    ).length;

  const completedMatches =
    matches.filter(
      (m) => m.status === "completed"
    ).length;

  return (
    <OrgLayout title="Match Control">

      {/* TOP STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Scheduled
          </div>

          <div style={styles.statValue}>
            {scheduledMatches}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Live Matches
          </div>

          <div style={styles.statValue}>
            {liveMatches}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Completed
          </div>

          <div style={styles.statValue}>
            {completedMatches}
          </div>

        </div>

      </div>

      {/* MATCH LIST */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          Match Operations
        </div>

        {loading ? (

          <div style={styles.placeholder}>
            Loading matches...
          </div>

        ) : matches.length === 0 ? (

          <div style={styles.emptyCard}>

            <div style={styles.emptyTitle}>
              No matches found
            </div>

            <div style={styles.emptyText}>
              Generate fixtures to start managing matches.
            </div>

          </div>

        ) : (

          <div style={styles.grid}>

            {matches.map((match) => (

              <div
                key={match._id}
                style={styles.card}
              >

                {/* LEAGUE */}
                <div style={styles.leagueTag}>
                  {match.leagueName}
                </div>

                {/* TEAMS */}
                <div style={styles.matchTeams}>

                  <div style={styles.team}>
                    {match.homeTeam?.name}
                  </div>

                  <div style={styles.vs}>
                    VS
                  </div>

                  <div style={styles.team}>
                    {match.awayTeam?.name}
                  </div>

                </div>

                {/* MATCH INFO */}
                <div style={styles.infoSection}>

                  <div style={styles.infoRow}>

                    <span style={styles.label}>
                      Round
                    </span>

                    <span style={styles.value}>
                      {match.round}
                    </span>

                  </div>

                  <div style={styles.infoRow}>

                    <span style={styles.label}>
                      Status
                    </span>

                    <span
                      style={{
                        ...styles.status,
                        background:
                          match.status === "live"
                            ? "#fee2e2"
                            : match.status === "completed"
                            ? "#dbeafe"
                            : "#dcfce7",
                        color:
                          match.status === "live"
                            ? "#991b1b"
                            : match.status === "completed"
                            ? "#1d4ed8"
                            : "#166534",
                      }}
                    >
                      {match.status}
                    </span>

                  </div>

                  <div style={styles.infoRow}>

                    <span style={styles.label}>
                      Date
                    </span>

                    <span style={styles.value}>
                      {match.matchDate
                        ? new Date(
                            match.matchDate
                          ).toLocaleString()
                        : "Not Scheduled"}
                    </span>

                  </div>

                </div>

                {/* ACTION */}
                <button
                  style={styles.controlBtn}
                  onClick={() =>
                    navigate(
                      `/org/matches/${match._id}`
                    )
                  }
                >
                  Open Match Control
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </OrgLayout>
  );
};

const styles = {

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },

  statCard: {
    background: "white",
    padding: "28px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  statLabel: {
    color: "#64748b",
    marginBottom: "12px",
    fontSize: "14px",
  },

  statValue: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#0f172a",
  },

  section: {
    marginBottom: "40px",
  },

  sectionHeader: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "24px",
  },

  placeholder: {
    background: "white",
    padding: "30px",
    borderRadius: "24px",
  },

  emptyCard: {
    background: "white",
    borderRadius: "28px",
    padding: "60px",
    textAlign: "center",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  emptyTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#0f172a",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "28px",
  },

  card: {
    background: "white",
    borderRadius: "28px",
    padding: "28px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  leagueTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "24px",
  },

  matchTeams: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  team: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    width: "40%",
    textAlign: "center",
  },

  vs: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
  },

  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "28px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#64748b",
    fontSize: "14px",
  },

  value: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: "14px",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  controlBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

};

export default MatchControlCenter;