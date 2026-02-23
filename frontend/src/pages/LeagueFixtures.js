import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LeagueFixtures = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("orgToken");
    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchLeague(token);
    fetchMatches(token);
  }, [leagueId]);

  const formatLabel = (value) => {
    if (!value) return "";
    return value
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const fetchLeague = async (token) => {
    const res = await axios.get(
      "http://localhost:5000/api/leagues",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const found = res.data.leagues.find(l => l._id === leagueId);
    setLeague(found);
  };

  const fetchMatches = async (token) => {
    const res = await axios.get(
      `http://localhost:5000/api/matches/league/${leagueId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const sorted = res.data.matches.sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;

      const homeCompare = a.homeTeam.name.localeCompare(b.homeTeam.name);
      if (homeCompare !== 0) return homeCompare;

      return a.awayTeam.name.localeCompare(b.awayTeam.name);
    });

    setMatches(sorted);
  };

  const generateFixtures = async () => {
    const token = localStorage.getItem("orgToken");
  
    await axios.post(
      `http://localhost:5000/api/matches/generate/${leagueId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  
    await fetchLeague(token);   // 🔥 refresh league
    await fetchMatches(token);
  };

  const scheduleMatch = async (matchId, date, time) => {
    if (!date || !time) return;

    const token = localStorage.getItem("orgToken");

    const combinedDate = new Date(`${date}T${time}:00`);

    await axios.put(
      `http://localhost:5000/api/matches/schedule/${matchId}`,
      { matchDate: combinedDate.toISOString() }, // 🔥 ISO format
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchMatches(token);
  };

  if (!league) return null;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.container}>

        {/* League Info */}
        <div style={styles.leagueCard}>
          <h2>{league.name}</h2>

          <div style={styles.leagueInfoRow}>
            <p><strong>Format:</strong> {formatLabel(league.format)}</p>

            {league.format === "round-robin" && (
              <p>
                <strong>Type:</strong>{" "}
                {league.roundRobinType === "double"
                  ? "Home & Away"
                  : "Single Round"}
              </p>
            )}

            <p><strong>Status:</strong> {formatLabel(league.status)}</p>
            <p><strong>Teams:</strong> {league.numberOfTeams}</p>
          </div>

        {league.status === "draft" ? (
            <button style={styles.generateBtn} onClick={generateFixtures}>
                Generate Fixtures
            </button>
          ) : (
            <p style={{ marginTop: "20px", fontWeight: "500", color: "green" }}>
                Fixtures Generated
            </p>
        )}
        </div>

        {/* Fixtures */}
        <h2 style={styles.heading}>Fixtures</h2>

        <div style={styles.grid}>
          {matches.map((match, index) => (
            <div key={match._id} style={styles.matchCard}>
              <h4>Match {index + 1}</h4>

              <div style={styles.teamRow}>
                <Team team={match.homeTeam} />
                <strong>VS</strong>
                <Team team={match.awayTeam} />
              </div>

              {match.matchDate ? (
                <p style={styles.scheduled}>
                  {new Date(match.matchDate).toLocaleString()}
                </p>
              ) : (
                <ScheduleBox
                  matchId={match._id}
                  scheduleMatch={scheduleMatch}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

/* Components */

const Team = ({ team }) => (
  <div style={styles.team}>
    {team?.logo && (
      <img src={team.logo} alt="logo" style={styles.logo} />
    )}
    <span>{team?.name}</span>
  </div>
);

const ScheduleBox = ({ matchId, scheduleMatch }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div style={styles.scheduleBox}>
      <input type="date" onChange={e => setDate(e.target.value)} />
      <input type="time" onChange={e => setTime(e.target.value)} />
      <button
        style={styles.saveBtn}
        onClick={() => scheduleMatch(matchId, date, time)}
      >
        Save
      </button>
    </div>
  );
};

/* Styles */

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
  container: { padding: "40px 80px" },
  leagueCard: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    marginBottom: "30px",
  },
  leagueInfoRow: {
    display: "flex",
    gap: "40px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  generateBtn: {
    marginTop: "20px",
    padding: "12px 18px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  heading: { marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "25px",
  },
  matchCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
  },
  teamRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  team: { display: "flex", alignItems: "center", gap: "10px" },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  scheduleBox: { marginTop: "15px", display: "flex", gap: "10px" },
  saveBtn: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  scheduled: {
    marginTop: "12px",
    fontWeight: "500",
  },
};

export default LeagueFixtures;