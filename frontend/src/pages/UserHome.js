import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* Top Branding Bar */}
      <div style={styles.topBar}>
        <div style={styles.branding}>
          ⚽ Kickoff
        </div>

        <div style={styles.topLinks}>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/org/login")}
          >
            Organization Login
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          Manage. Compete. Celebrate.
        </h1>

        <p style={styles.heroSubtitle}>
          Kickoff is your complete league management platform —
          create leagues, schedule fixtures, track standings,
          and follow live match updates.
        </p>

        <button
          style={styles.viewBtn}
          onClick={() => navigate("/leagues")}
        >
          View Leagues
        </button>
      </div>

      {/* Bottom Pane */}
      <div style={styles.bottomPane}>
        <h3>Want to host your league on Kickoff?</h3>

        <p>
          Organize tournaments, manage teams, and publish
          fixtures publicly with ease.
        </p>

        <button
          style={styles.requestBtn}
          onClick={() => navigate("/request-organization")}
        >
          Request to Host on Kickoff
        </button>
      </div>

    </div>
  );
};

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Poppins, sans-serif",
    background: "#FBF6E9",
  },

  /* Top Bar */
  topBar: {
    height: "70px",
    background: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 60px",
  },

  branding: {
    color: "white",
    fontSize: "24px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  topLinks: {
    display: "flex",
    alignItems: "center",
  },

  loginBtn: {
    background: "transparent",
    color: "white",
    border: "1px solid white",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  /* Hero */
  heroSection: {
    flex: 1,
    textAlign: "center",
    padding: "80px 20px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: "42px",
    marginBottom: "20px",
    color: "#111827",
  },

  heroSubtitle: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "40px",
    lineHeight: "1.6",
  },

  viewBtn: {
    padding: "14px 28px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  /* Bottom Pane */
  bottomPane: {
    background: "white",
    padding: "50px 20px",
    textAlign: "center",
    boxShadow: "0 -5px 20px rgba(0,0,0,0.05)",
  },

  requestBtn: {
    marginTop: "20px",
    padding: "12px 22px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default UserHome;