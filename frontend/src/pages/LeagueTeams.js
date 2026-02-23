import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LeagueTeams = () => {
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
  }, [leagueId]);

  const fetchLeague = async (token) => {
    const res = await axios.get(
      "http://localhost:5000/api/leagues",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const found = res.data.leagues.find(l => l._id === leagueId);
    setLeague(found);
  };

  const fetchTeams = async (token) => {
    const res = await axios.get(
      `http://localhost:5000/api/teams/league/${leagueId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTeams(res.data.teams);
  };

  if (!league) return null;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% */}
        <div style={styles.leftPane}>
          <h2>{league.name}</h2>

          <div style={styles.infoCard}>
            <p>Season: {league.season}</p>
            <p>Format: {league.format}</p>
            <p>
              Teams: {teams.length} / {league.numberOfTeams}
            </p>
          </div>

          <button
            style={styles.createBtn}
            onClick={() =>
              navigate(`/org/leagues/${leagueId}/teams/create`)
            }
          >
            + Create Team
          </button>
        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.grid}>
            {teams.map((team) => (
              <div key={team._id} style={styles.card}>

                {team.logo && (
                  <img
                    src={team.logo}
                    alt="logo"
                    style={styles.logo}
                  />
                )}

                <h4>{team.name}</h4>
                <p>Coach: {team.coachName || "N/A"}</p>

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
  },
  layout: { display: "flex", paddingTop: "40px" },
  leftPane: { width: "40%", padding: "0 60px" },
  rightPane: { width: "60%", paddingRight: "60px" },

  infoCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  createBtn: {
    padding: "15px 180px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  logo: {
    width: "80px",
    marginBottom: "10px",
  },

  manageBtn: {
    marginTop: "10px",
    padding: "8px 14px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default LeagueTeams;