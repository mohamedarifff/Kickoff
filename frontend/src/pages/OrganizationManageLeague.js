import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrganizationManageLeague = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("orgToken");
    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchLeague(token);
    fetchTeams(token);
  }, [leagueId, navigate]);

  const fetchLeague = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leagues",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const found = res.data.leagues.find(l => l._id === leagueId);
      setLeague(found);
    } catch {
      console.error("Failed to fetch league");
    }
  };

  const fetchTeams = async (token) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/teams/league/${leagueId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeams(res.data.teams);
    } catch {
      console.error("Failed to fetch teams");
    }
  };

  if (!league) return null;

  const teamCount = teams.length;
  const capacity = league.numberOfTeams;
  const isFull = teamCount === capacity;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% — League Info */}
        <div style={styles.leftPane}>
          <h2 style={styles.leftTitle}>{league.name}</h2>

          <div style={styles.infoCard}>
            <p><strong>Season:</strong> {league.season}</p>
            <p><strong>Format:</strong> {league.format}</p>
            <p><strong>Status:</strong> {league.status}</p>
            <p><strong>Teams:</strong> {teamCount} / {capacity}</p>
          </div>

          {isFull ? (
            <div style={styles.fullBadge}>
              League ready for fixture generation
            </div>
          ) : (
            <div style={styles.warningBadge}>
              Add more teams to continue
            </div>
          )}
        </div>

        {/* RIGHT 60% — Widgets */}
        <div style={styles.rightPane}>
          <div style={styles.widgetRow}>

            <div
              style={styles.widget}
              onClick={() => navigate(`/org/leagues/${leagueId}/teams`)}
            >
              👥
              <span style={styles.widgetTitle}>Teams</span>
            </div>

            <div
              style={styles.widget}
              onClick={() => navigate(`/org/leagues/${leagueId}/fixtures`)}
            >
              🏟
              <span style={styles.widgetTitle}>Fixtures</span>
            </div>

            <div
              style={styles.widget}
              onClick={() => navigate(`/org/leagues/${leagueId}/standings`)}
            >
              📊
              <span style={styles.widgetTitle}>Standings</span>
            </div>

            <div
              style={styles.widget}
              onClick={() => navigate(`/org/leagues/${leagueId}/settings`)}
            >
              ⚙
              <span style={styles.widgetTitle}>League Settings</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FBF6E9",
    fontFamily: "Poppins, sans-serif",
  },

  topbar: {
    height: "70px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    fontSize: "22px",
    fontWeight: "600",
  },

  layout: {
    display: "flex",
    paddingTop: "40px",
  },

  leftPane: {
    width: "40%",
    padding: "0 60px",
  },

  leftTitle: {
    marginBottom: "20px",
  },

  infoCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },

  fullBadge: {
    background: "#dcfce7",
    padding: "12px",
    borderRadius: "8px",
  },

  warningBadge: {
    background: "#fee2e2",
    padding: "12px",
    borderRadius: "8px",
  },

  rightPane: {
    width: "60%",
    paddingRight: "60px",
  },

  widgetRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 2fr)",
    gap: "40px",
  },

  widget: {
    background: "white",
    height: "160px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  widgetTitle: {
    fontSize: "14px",
    marginTop: "10px",
    color: "#111827",
    fontWeight: "500",
  },
};

export default OrganizationManageLeague;