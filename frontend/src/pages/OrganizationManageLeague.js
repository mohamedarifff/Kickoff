import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const OrganizationManageLeague = () => {

  const { leagueId } = useParams();

  const navigate = useNavigate();

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
    fetchTeams();

  }, [leagueId]);

  /* =====================================
     FETCH LEAGUE
  ===================================== */

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
              l._id === leagueId
          );

        if (!foundLeague) {

          setError(
            "League not found"
          );

          return;
        }

        setLeague(foundLeague);

      } catch (error) {

        console.error(
          "Failed to fetch league"
        );

        setError(

          error.response?.data
            ?.message ||

          "Failed to load league"

        );

      } finally {

        setLoading(false);

      }
    };

  /* =====================================
     FETCH TEAMS
  ===================================== */

  const fetchTeams =
    async () => {

      try {

        const res =
          await API.get(
            `/teams/league/${leagueId}`
          );

        setTeams(
          res.data.teams || []
        );

      } catch (error) {

        console.error(
          "Failed to fetch teams"
        );

      }
    };

  if (loading) {

    return (

      <OrgLayout title="League">

        <div style={styles.loadingCard}>
          Loading league...
        </div>

      </OrgLayout>

    );
  }

  if (!league) {

    return (

      <OrgLayout title="League">

        <div style={styles.warningBox}>
          {error || "League not found"}
        </div>

      </OrgLayout>

    );
  }

  const teamCount =
    teams.length;

  const capacity =
    league.numberOfTeams;

  const isFull =
    teamCount === capacity;

  return (

    <OrgLayout title={league.name}>

      {/* BACK BUTTON */}
      <button
        style={styles.backBtn}
        onClick={() =>
          navigate("/org/leagues")
        }
      >
        ← Back to Leagues
      </button>

      {/* HERO CARD */}
      <div style={styles.heroCard}>

        <div style={styles.heroLeft}>

          {league.logo ? (

            <img
              src={league.logo}
              alt={league.name}
              style={styles.logo}
            />

          ) : (

            <div style={styles.logoPlaceholder}>
              {league.name?.charAt(0)}
            </div>

          )}

          <div>

            <div style={styles.leagueName}>
              {league.name}
            </div>

            <div style={styles.leagueMeta}>
              {league.season}
            </div>

          </div>

        </div>

        <div style={styles.statusBadge}>
          {league.status
            ?.replaceAll("_", " ")}
        </div>

      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Teams
          </div>

          <div style={styles.statValue}>
            {teamCount}/{capacity}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Format
          </div>

          <div style={styles.statValueSmall}>

            {league.format
              ?.replaceAll("_", " ")
              ?.replace(/\b\w/g,
                (c) =>
                  c.toUpperCase()
              )}

          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Season
          </div>

          <div style={styles.statValueSmall}>
            {league.season}
          </div>

        </div>

      </div>

      {/* LEAGUE STATUS */}
      <div
        style={
          isFull
            ? styles.successBox
            : styles.warningBox
        }
      >

        {isFull

          ? "League ready for fixture generation"

          : `League capacity not reached (${teamCount}/${capacity})`

        }

      </div>

      {/* MODULES */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          League Modules
        </div>

        <div style={styles.moduleGrid}>

          {/* Teams */}
          <div
            style={styles.moduleCard}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/teams`
              )
            }
          >

            <div style={styles.moduleTag}>
              Management
            </div>

            <div style={styles.moduleTitle}>
              Teams
            </div>

            <div style={styles.moduleText}>
              Manage league teams and player groups.
            </div>

          </div>

          {/* Fixtures */}
          <div
            style={styles.moduleCard}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/fixtures`
              )
            }
          >

            <div style={styles.moduleTag}>
              Scheduling
            </div>

            <div style={styles.moduleTitle}>
              Fixtures
            </div>

            <div style={styles.moduleText}>
              Generate and organize match fixtures.
            </div>

          </div>

          {/* Matches */}
          <div
            style={styles.moduleCard}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/matches`
              )
            }
          >

            <div style={styles.moduleTag}>
              Match Center
            </div>

            <div style={styles.moduleTitle}>
              Matches
            </div>

            <div style={styles.moduleText}>
              Control live matches and scheduling.
            </div>

          </div>

          {/* Standings */}
          <div
            style={styles.moduleCard}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/standings`
              )
            }
          >

            <div style={styles.moduleTag}>
              Analytics
            </div>

            <div style={styles.moduleTitle}>
              Standings
            </div>

            <div style={styles.moduleText}>
              Track rankings and team performance.
            </div>

          </div>

          {/* Settings */}
          <div
            style={styles.moduleCard}
            onClick={() =>
              navigate(
                `/org/leagues/${leagueId}/settings`
              )
            }
          >

            <div style={styles.moduleTag}>
              Configuration
            </div>

            <div style={styles.moduleTitle}>
              Settings
            </div>

            <div style={styles.moduleText}>
              Configure league preferences and rules.
            </div>

          </div>

        </div>

      </div>

    </OrgLayout>
  );
};

const styles = {

  backBtn: {
    marginBottom: "24px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  loadingCard: {
    background: "white",
    padding: "30px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  heroCard: {
    background: "white",
    borderRadius: "28px",
    padding: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  logo: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    objectFit: "cover",
  },

  logoPlaceholder: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "34px",
    fontWeight: "700",
  },

  leagueName: {
    fontSize: "34px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },

  leagueMeta: {
    color: "#64748b",
    fontSize: "15px",
  },

  statusBadge: {
    padding: "10px 18px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "28px",
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
    marginBottom: "14px",
    fontSize: "14px",
  },

  statValue: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#0f172a",
  },

  statValueSmall: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    textTransform: "capitalize",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
    padding: "18px",
    borderRadius: "18px",
    fontWeight: "600",
    marginBottom: "35px",
  },

  warningBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "18px",
    borderRadius: "18px",
    fontWeight: "600",
    marginBottom: "35px",
  },

  section: {
    marginBottom: "40px",
  },

  sectionHeader: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#0f172a",
  },

  moduleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  moduleCard: {
    background: "white",
    borderRadius: "24px",
    padding: "30px",
    cursor: "pointer",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
    transition: "0.2s",
  },

  moduleTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  moduleTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  },

  moduleText: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#64748b",
  },

};

export default OrganizationManageLeague;