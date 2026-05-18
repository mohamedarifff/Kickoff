import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const OrganizationDashboard = () => {

  const navigate = useNavigate();

  const [orgData, setOrgData] = useState(null);

  const [stats, setStats] = useState({
    leagues: 0,
    teams: 0,
    activeMatches: 0,
    completedMatches: 0,
  });

  useEffect(() => {

    const token = localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
      return;
    }

    try {

      const decoded = JSON.parse(
        atob(token.split(".")[1])
      );

      if (decoded.role !== "organization") {
        navigate("/org/login");
        return;
      }

      setOrgData(decoded);

      fetchDashboardStats();

    } catch {
      navigate("/org/login");
    }

  }, [navigate]);

  const fetchDashboardStats = async () => {

    try {

      const leagueRes =
        await API.get("/leagues");

      const leagues =
        leagueRes.data.leagues || [];

      let totalTeams = 0;

      let activeMatches = 0;

      let completedMatches = 0;

      for (const league of leagues) {

        /* TEAMS */
        try {

          const teamRes =
            await API.get(
              `/teams/league/${league._id}`
            );

          totalTeams +=
            teamRes.data.count || 0;

        } catch {}

        /* MATCHES */
        try {

          const matchRes =
            await API.get(
              `/matches/league/${league._id}`
            );

          const matches =
            matchRes.data.matches || [];

          activeMatches +=
            matches.filter(
              (m) =>
                m.status === "live" ||
                m.status === "paused" ||
                m.status === "half-time"
            ).length;

          completedMatches +=
            matches.filter(
              (m) =>
                m.status === "completed"
            ).length;

        } catch {}

      }

      setStats({

        leagues:
          leagues.length,

        teams:
          totalTeams,

        activeMatches,

        completedMatches,

      });

    } catch (error) {

      console.error(
        "Dashboard Stats Error:",
        error
      );

    }
  };

  if (!orgData) return null;

  return (
    <OrgLayout title="Dashboard">

      {/* HEADER CARD */}
      <div style={styles.profileCard}>

        <div style={styles.profileCircle}>
          {orgData.organizationName?.charAt(0)}
        </div>

        <div>

          <div style={styles.profileName}>
            {orgData.organizationName}
          </div>

          <div style={styles.profileEmail}>
            {orgData.email}
          </div>

        </div>

      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Total Leagues
          </div>

          <div style={styles.statValue}>
            {stats.leagues}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Teams
          </div>

          <div style={styles.statValue}>
            {stats.teams}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Active Matches
          </div>

          <div style={styles.statValue}>
            {stats.activeMatches}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statLabel}>
            Completed Matches
          </div>

          <div style={styles.statValue}>
            {stats.completedMatches}
          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          Quick Actions
        </div>

        <div style={styles.quickGrid}>

          <div
            style={styles.quickCard}
            onClick={() =>
              navigate("/org/leagues/create")
            }
          >

            <div style={styles.quickTag}>
              League
            </div>

            <div style={styles.quickTitle}>
              Create League
            </div>

            <div style={styles.quickDescription}>
              Create and configure a new football league.
            </div>

          </div>

          <div
            style={styles.quickCard}
            onClick={() =>
              navigate("/org/leagues")
            }
          >

            <div style={styles.quickTag}>
              Management
            </div>

            <div style={styles.quickTitle}>
              Manage Leagues
            </div>

            <div style={styles.quickDescription}>
              Access leagues, teams, fixtures and settings.
            </div>

          </div>

          <div style={styles.quickCard}>

            <div style={styles.quickTag}>
              Scheduling
            </div>

            <div style={styles.quickTitle}>
              Schedule Matches
            </div>

            <div style={styles.quickDescription}>
              Organize upcoming fixtures and kickoff timings.
            </div>

          </div>

          <div style={styles.quickCard}>

            <div style={styles.quickTag}>
              Analytics
            </div>

            <div style={styles.quickTitle}>
              View Standings
            </div>

            <div style={styles.quickDescription}>
              Track league rankings and team performance.
            </div>

          </div>

        </div>

      </div>

      {/* ACTIVITY */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          Recent Activity
        </div>

        <div style={styles.activityCard}>

          <div style={styles.activityItem}>
            League fixtures generated successfully.
          </div>

          <div style={styles.activityItem}>
            New team added to Summer League.
          </div>

          <div style={styles.activityItem}>
            Match scheduled for tomorrow.
          </div>

        </div>

      </div>

    </OrgLayout>
  );
};

const styles = {

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "white",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "35px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.05)",
  },

  profileCircle: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "22px",
  },

  profileName: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "18px",
    marginBottom: "4px",
  },

  profileEmail: {
    fontSize: "14px",
    color: "#64748b",
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
    fontSize: "42px",
    fontWeight: "700",
    color: "#0f172a",
  },

  section: {
    marginBottom: "40px",
  },

  sectionHeader: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "22px",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },

  quickCard: {
    background: "white",
    padding: "34px",
    borderRadius: "24px",
    cursor: "pointer",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
    transition: "0.2s",
  },

  quickTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "22px",
  },

  quickTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  },

  quickDescription: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#64748b",
  },

  activityCard: {
    background: "white",
    padding: "30px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  activityItem: {
    padding: "18px 0",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "15px",
  },

};

export default OrganizationDashboard;