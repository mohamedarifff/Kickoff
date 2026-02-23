import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PublicLeagues = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/public/leagues"
      );
      setLeagues(res.data.leagues);
    } catch (error) {
      console.error("Failed to fetch leagues");
    }
  };

  const filtered = leagues.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* Branding */}
      <div style={styles.topbar}>
        <div style={styles.brand} onClick={() => navigate("/")}>
          Kickoff
        </div>
      </div>

      <div style={styles.container}>
        <h1>Browse Leagues</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search league..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* Horizontal Scroll */}
        <h3 style={{ marginTop: "40px" }}>Active Leagues</h3>

        <div style={styles.horizontalScroll}>
          {leagues.map(league => (
            <div
              key={league._id}
              style={styles.smallCard}
              onClick={() => navigate(`/league/${league._id}`)}
            >
              {league.logo && (
                <img src={league.logo} alt="" style={styles.logo} />
              )}
              <span>{league.name}</span>
            </div>
          ))}
        </div>

        {/* Search Results */}
        {search && (
          <>
            <h3 style={{ marginTop: "40px" }}>Search Results</h3>
            <div style={styles.grid}>
              {filtered.map(league => (
                <div
                  key={league._id}
                  style={styles.card}
                  onClick={() => navigate(`/league/${league._id}`)}
                >
                  {league.logo && (
                    <img src={league.logo} alt="" style={styles.logoLarge} />
                  )}
                  <h4>{league.name}</h4>
                  <p>{league.season}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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
  container: {
    padding: "40px 80px",
  },
  search: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    marginTop: "20px",
  },
  horizontalScroll: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    marginTop: "20px",
  },
  smallCard: {
    minWidth: "150px",
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
  },
  logo: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  logoLarge: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
};

export default PublicLeagues;