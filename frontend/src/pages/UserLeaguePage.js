import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserLeaguePage = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [activeTab, setActiveTab] = useState("fixtures");

  useEffect(() => {
    fetchLeague();
    fetchMatches();
    fetchStandings();
  }, [leagueId]);

  const fetchLeague = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/public/leagues/${leagueId}`
    );
    setLeague(res.data.league);
  };

  const fetchMatches = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/public/leagues/${leagueId}/matches`
    );

    const sorted = res.data.matches.sort(
      (a, b) =>
        new Date(a.matchDate || 9999999999999) -
        new Date(b.matchDate || 9999999999999)
    );

    setMatches(sorted);
  };

  const fetchStandings = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/public/leagues/${leagueId}/standings`
    );
    setStandings(res.data.teams);
  };

  if (!league) return null;

  const formatLabel = (format) => {
    if (format === "round-robin") return "Round Robin";
    if (format === "knockout") return "Knockout";
    if (format === "group_knockout") return "Group + Knockout";
    return format;
  };

  return (
    <div style={styles.page}>
      {/* Top Branding */}
      <div style={styles.topbar}>
        <div style={styles.brand} onClick={() => navigate("/")}>
          Kickoff
        </div>
      </div>

      {/* League Banner */}
      <div style={styles.banner}>
        {league.logo && (
          <img src={league.logo} alt="logo" style={styles.bannerLogo} />
        )}

        <div>
          <h1 style={styles.bannerTitle}>{league.name}</h1>
          <p style={styles.bannerMeta}>
            {formatLabel(league.format)} • {league.season}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["fixtures", "standings", "results"].map(tab => (
          <button
            key={tab}
            style={
              activeTab === tab
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>

        {activeTab === "fixtures" &&
          matches.map(match => (
            <MatchCard match={match} key={match._id} />
          ))}

        {activeTab === "results" &&
          matches
            .filter(m => m.status === "completed")
            .map(match => (
              <MatchCard match={match} key={match._id} />
            ))}

        {activeTab === "standings" && (
          <StandingsTable standings={standings} />
        )}
      </div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const MatchCard = ({ match }) => {
  const isCompleted = match.status === "completed";

  return (
    <div style={styles.matchCard}>
      <div style={styles.teamRow}>
        <Team team={match.homeTeam} />
        <div style={styles.scoreBox}>
          {isCompleted
            ? `${match.homeScore} - ${match.awayScore}`
            : "VS"}
        </div>
        <Team team={match.awayTeam} />
      </div>

      <div style={styles.date}>
        {match.matchDate
          ? new Date(match.matchDate).toLocaleString()
          : "TBA"}
      </div>
    </div>
  );
};

const Team = ({ team }) => (
  <div style={styles.team}>
    {team?.logo && (
      <img src={team.logo} alt="logo" style={styles.teamLogo} />
    )}
    <span>{team?.name}</span>
  </div>
);

const StandingsTable = ({ standings }) => (
  <table style={styles.table}>
    <thead>
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GF</th>
        <th>GA</th>
        <th>Pts</th>
      </tr>
    </thead>
    <tbody>
      {standings.map(team => (
        <tr key={team._id}>
          <td>{team.name}</td>
          <td>{team.played}</td>
          <td>{team.wins}</td>
          <td>{team.draws}</td>
          <td>{team.losses}</td>
          <td>{team.goalsFor}</td>
          <td>{team.goalsAgainst}</td>
          <td>{team.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Poppins",
  },

  topbar: {
    height: "70px",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
  },

  brand: {
    fontSize: "22px",
    fontWeight: "600",
    cursor: "pointer",
  },

  banner: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    padding: "40px",
    background: "#1e293b",
  },

  bannerLogo: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
  },

  bannerTitle: {
    fontSize: "32px",
  },

  bannerMeta: {
    opacity: 0.8,
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "30px",
  },

  tab: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "16px",
    cursor: "pointer",
  },

  activeTab: {
    background: "#f59e0b",
    border: "none",
    color: "black",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer",
  },

  content: {
    padding: "40px 80px",
    maxWidth: "900px",
    margin: "auto",
  },

  matchCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  teamRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  team: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  teamLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },

  scoreBox: {
    fontSize: "20px",
    fontWeight: "600",
  },

  date: {
    marginTop: "10px",
    opacity: 0.7,
    textAlign: "center",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default UserLeaguePage;