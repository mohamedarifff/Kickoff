import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueTeams = () => {

  const { leagueId } = useParams();

  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {

    const token =
      localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchLeague(token);
    fetchTeams(token);

  }, [leagueId]);

  const fetchLeague = async (token) => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/leagues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const found =
        res.data.leagues.find(
          (l) => l._id === leagueId
        );

      setLeague(found);

    } catch (error) {

      console.error(
        "Failed to fetch league"
      );

    }
  };

  const fetchTeams = async (token) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/teams/league/${leagueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeams(res.data.teams);

    } catch (error) {

      console.error(
        "Failed to fetch teams"
      );

    }
  };

  if (!league) return null;

  return (
    <OrgLayout title="Teams">

      {/* TOP SECTION */}
      <div style={styles.topSection}>

        <div>

          <div style={styles.subHeading}>
            Team management center
          </div>

          <h2 style={styles.heading}>
            {league.name}
          </h2>

        </div>

        <button
          style={styles.createBtn}
          onClick={() =>
            navigate(
              `/org/leagues/${leagueId}/teams/create`
            )
          }
        >
          Create Team
        </button>

      </div>

      {/* LEAGUE INFO */}
      <div style={styles.infoGrid}>

        <div style={styles.infoCard}>

          <div style={styles.infoLabel}>
            Season
          </div>

          <div style={styles.infoValue}>
            {league.season}
          </div>

        </div>

        <div style={styles.infoCard}>

          <div style={styles.infoLabel}>
            Format
          </div>

          <div style={styles.infoValue}>
            {league.format}
          </div>

        </div>

        <div style={styles.infoCard}>

          <div style={styles.infoLabel}>
            Teams
          </div>

          <div style={styles.infoValue}>
            {teams.length} / {league.numberOfTeams}
          </div>

        </div>

      </div>

      {/* EMPTY STATE */}
      {teams.length === 0 ? (

        <div style={styles.emptyCard}>

          <div style={styles.emptyTitle}>
            No teams added yet
          </div>

          <div style={styles.emptyText}>
            Start building your competition by creating teams.
          </div>

          <button
            style={styles.emptyBtn}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/teams/create`
              )
            }
          >
            Create First Team
          </button>

        </div>

      ) : (

        <div style={styles.grid}>

          {teams.map((team) => (

            <div
              key={team._id}
              style={styles.card}
            >

              {/* HEADER */}
              <div style={styles.cardTop}>

                {team.logo ? (

                  <img
                    src={team.logo}
                    alt={team.name}
                    style={styles.logo}
                  />

                ) : (

                  <div style={styles.logoPlaceholder}>
                    {team.name?.charAt(0)}
                  </div>

                )}

                <div>

                  <div style={styles.teamName}>
                    {team.name}
                  </div>

                  <div style={styles.coachName}>
                    {team.coachName || "No Coach"}
                  </div>

                </div>

              </div>

              {/* DETAILS */}
              <div style={styles.detailSection}>

                <div style={styles.detailRow}>

                  <span style={styles.label}>
                    League
                  </span>

                  <span style={styles.value}>
                    {league.name}
                  </span>

                </div>

                <div style={styles.detailRow}>

                  <span style={styles.label}>
                    Season
                  </span>

                  <span style={styles.value}>
                    {league.season}
                  </span>

                </div>

              </div>

              {/* ACTION */}
              <button
                style={styles.manageBtn}
                onClick={() =>
                  navigate(
                    `/org/leagues/${leagueId}/teams/${team._id}`
                  )
                }
              >
                Manage Team
              </button>

            </div>

          ))}

        </div>

      )}

    </OrgLayout>
  );
};

const styles = {

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  subHeading: {
    color: "#64748b",
    marginBottom: "8px",
    fontSize: "14px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a",
  },

  createBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.25)",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "35px",
  },

  infoCard: {
    background: "white",
    padding: "28px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  infoLabel: {
    color: "#64748b",
    marginBottom: "12px",
    fontSize: "14px",
  },

  infoValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    textTransform: "capitalize",
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
    marginBottom: "28px",
    fontSize: "15px",
  },

  emptyBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },

  card: {
    background: "white",
    borderRadius: "28px",
    padding: "28px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "28px",
  },

  logo: {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "20px",
  },

  logoPlaceholder: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "26px",
  },

  teamName: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  coachName: {
    color: "#64748b",
    fontSize: "14px",
  },

  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "28px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
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

  manageBtn: {
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

export default LeagueTeams;