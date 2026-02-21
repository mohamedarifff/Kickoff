import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrganizationLeagues = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchLeagues(token);
  }, [navigate]);

  const fetchLeagues = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leagues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeagues(res.data.leagues);
    } catch (error) {
      console.error("Failed to fetch leagues", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Top Branding Bar */}
      <div style={styles.topbar}>
        Kickoff
      </div>

      <div style={styles.layout}>

        {/* LEFT 40% (Future Navigation Panel) */}
        <div style={styles.leftPane}>
          <h2 style={styles.leftTitle}>League Management</h2>
          <p style={styles.leftDesc}>
            Create, organize, and manage your football competitions.
          </p>

          <button
            style={styles.createBtn}
            onClick={() => navigate("/org/leagues/create")}
          >
            + Create New League
          </button>
        </div>

        {/* RIGHT 60% (League List) */}
        <div style={styles.rightPane}>

          {loading ? (
            <div style={styles.placeholder}>Loading leagues...</div>
          ) : leagues.length === 0 ? (
            <div style={styles.placeholder}>
              No leagues created yet.
            </div>
          ) : (
            <div style={styles.grid}>
              {leagues.map((league) => (
                <div key={league._id} style={styles.card}>

                  {league.logo && (
                    <img
                      src={league.logo}
                      alt={league.name}
                      style={styles.logo}
                    />
                  )}

                  <h3 style={styles.leagueTitle}>
                    {league.name}
                  </h3>

                  <p><strong>Season:</strong> {league.season}</p>
                  <p><strong>Format:</strong> {league.format}</p>
                  <p><strong>Status:</strong> {league.status}</p>

                  <button
                    style={styles.manageBtn}
                    onClick={() =>
                      navigate(`/org/leagues/${league._id}`)
                    }
                  >
                    Manage League
                  </button>

                </div>
              ))}
            </div>
          )}

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
    height: "calc(100vh - 70px)",
  },

  leftPane: {
    width: "40%",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  leftTitle: {
    fontSize: "32px",
    marginBottom: "15px",
  },

  leftDesc: {
    fontSize: "16px",
    marginBottom: "25px",
    lineHeight: "1.6",
  },

  createBtn: {
    padding: "14px 20px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "220px",
  },

  rightPane: {
    width: "60%",
    padding: "50px",
    overflowY: "auto",
  },

  placeholder: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  logo: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  leagueTitle: {
    marginBottom: "10px",
  },

  manageBtn: {
    marginTop: "15px",
    padding: "8px 15px",
    background: "#118B50",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default OrganizationLeagues;