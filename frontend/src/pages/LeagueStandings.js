import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueStandings = () => {

  const { leagueId } =
    useParams();

  const navigate =
    useNavigate();

  const [league, setLeague] =
    useState(null);

  const [teams, setTeams] =
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

    fetchStandings();

  }, [leagueId]);

  const fetchLeague =
    async () => {

      try {

        const res =
          await API.get(
            "/leagues"
          );

        const found =
          res.data.leagues.find(
            (l) =>
              l._id ===
              leagueId
          );

        if (!found) {

          setError(
            "League not found"
          );

          return;

        }

        setLeague(found);

      } catch (error) {

        console.error(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to load league"

        );

      }
    };

  const fetchStandings =
    async () => {

      try {

        const res =
          await API.get(
            `/teams/league/${leagueId}`
          );

        const sorted =
          [...(res.data.teams || [])]
            .sort(
              (a, b) => {

                if (
                  b.points !==
                  a.points
                ) {

                  return (
                    b.points -
                    a.points
                  );

                }

                const goalDiffA =
                  (a.goalsFor || 0) -
                  (a.goalsAgainst || 0);

                const goalDiffB =
                  (b.goalsFor || 0) -
                  (b.goalsAgainst || 0);

                return (
                  goalDiffB -
                  goalDiffA
                );

              }
            );

        setTeams(sorted);

      } catch (error) {

        console.error(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to load standings"

        );

      } finally {

        setLoading(false);

      }
    };

  if (loading)
    return null;

  if (!league)
    return null;

  return (
    <OrgLayout title="Standings">

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
            {league.season}
            {" • "}
            League Table
          </div>

        </div>

        <div style={styles.teamCount}>
          {teams.length} Teams
        </div>

      </div>

      {/* TABLE CARD */}
      <div style={styles.tableCard}>

        {/* TABLE HEADER */}
        <div style={styles.tableHeader}>

          <div>Team</div>

          <div style={{ textAlign: "center" }}>
            P
          </div>

          <div style={{ textAlign: "center" }}>
            W
          </div>

          <div style={{ textAlign: "center" }}>
            D
          </div>

          <div style={{ textAlign: "center" }}>
            L
          </div>

          <div style={{ textAlign: "center" }}>
            GF
          </div>

          <div style={{ textAlign: "center" }}>
            GA
          </div>

          <div style={{ textAlign: "center" }}>
            GD
          </div>

          <div style={{ textAlign: "center" }}>
            PTS
          </div>

        </div>

        {/* TABLE ROWS */}
        {teams.map(
          (team, index) => {

            const goalDiff =
              (team.goalsFor || 0) -
              (team.goalsAgainst || 0);

            return (

              <div
                key={team._id}
                style={{
                  ...styles.row,
                  background:
                    index === 0
                      ? "#f0fdf4"
                      : "white",
                }}
              >

                {/* TEAM */}
                <div style={styles.colTeam}>

                  <div style={styles.position}>
                    {index + 1}
                  </div>

                  {team.logo ? (

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
                      {team.name?.charAt(
                        0
                      )}
                    </div>

                  )}

                  <span
                    style={
                      styles.teamName
                    }
                  >
                    {team.name}
                  </span>

                </div>

                {/* STATS */}
                <div style={styles.col}>
                  {team.played || 0}
                </div>

                <div style={styles.col}>
                  {team.wins || 0}
                </div>

                <div style={styles.col}>
                  {team.draws || 0}
                </div>

                <div style={styles.col}>
                  {team.losses || 0}
                </div>

                <div style={styles.col}>
                  {team.goalsFor || 0}
                </div>

                <div style={styles.col}>
                  {team.goalsAgainst || 0}
                </div>

                <div style={styles.col}>
                  {goalDiff}
                </div>

                <div
                  style={
                    styles.colPoints
                  }
                >
                  {team.points || 0}
                </div>

              </div>

            );

          }
        )}

      </div>

    </OrgLayout>
  );
};

const styles = {

  hero: {
    background: "white",
    borderRadius: "28px",
    padding: "30px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "30px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  heroTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },

  heroMeta: {
    color: "#64748b",
  },

  teamCount: {
    padding: "12px 18px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
  },

  tableCard: {
    background: "white",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "3fr repeat(7, 1fr) 1.2fr",
    alignItems: "center",
    padding: "22px 26px",
    background: "#0f172a",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.3px",
  },

  row: {
    display: "flex",
    alignItems: "center",
    padding: "20px 26px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  colTeam: {
    flex: 3,
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  col: {
    flex: 1,
    textAlign: "center",
    color: "#0f172a",
    fontWeight: "600",
    fontSize: "14px",
  },

  colPoints: {
    flex: 1,
    textAlign: "center",
    color: "#15803d",
    fontWeight: "700",
    fontSize: "16px",
  },

  position: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },

  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    objectFit: "cover",
  },

  logoPlaceholder: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
  },

  teamName: {
    fontWeight: "700",
    color: "#0f172a",
  },

};

export default LeagueStandings;