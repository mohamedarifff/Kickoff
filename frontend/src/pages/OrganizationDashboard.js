import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role !== "organization") {
        navigate("/org/login");
        return;
      }

      setOrgData(decoded);
    } catch {
      navigate("/org/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    navigate("/org/login");
  };

  if (!orgData) return null;

  return (
    <div style={styles.page}>
      {/* Top Branding Bar */}
      <div style={styles.topbar}>
        <span>Kickoff</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.layout}>
        {/* LEFT 40% — Organization Info */}
        <div style={styles.leftPane}>
          <h2 style={styles.leftTitle}>
            {orgData.organizationName}
          </h2>

          <div style={styles.infoCard}>
            <p><strong>Email:</strong> {orgData.email}</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Role:</strong> Organization Admin</p>
          </div>

          <p style={styles.description}>
            Manage leagues, teams, fixtures and real-time statistics
            from this dashboard.
          </p>
        </div>

        {/* RIGHT 60% — Widgets */}
        <div style={styles.rightPane}>
          <h2 style={styles.sectionHeading}>Dashboard Modules</h2>

          <div style={styles.widgetGrid}>
            <div
              style={styles.widget}
              onClick={() => navigate("/org/leagues")}
            >
              ⚽
              <span style={styles.widgetTitle}>Leagues</span>
            </div>

            <div style={styles.widget}>
              👥
              <span style={styles.widgetTitle}>Teams</span>
            </div>

            <div style={styles.widget}>
              📊
              <span style={styles.widgetTitle}>Statistics</span>
            </div>

            <div style={styles.widget}>
              🏟
              <span style={styles.widgetTitle}>Matches</span>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    fontSize: "20px",
    fontWeight: "600",
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  layout: {
    display: "flex",
    paddingTop: "40px",
    paddingBottom: "60px",
  },

  leftPane: {
    width: "40%",
    padding: "0 70px",
  },

  leftTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  infoCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },

  description: {
    fontSize: "14px",
    lineHeight: "1.6",
  },

  rightPane: {
    width: "60%",
    paddingRight: "60px",
  },

  sectionHeading: {
    marginBottom: "25px",
  },

  widgetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "25px",
  },

  widget: {
    background: "white",
    height: "160px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  widgetTitle: {
    fontSize: "16px",
    marginTop: "10px",
    color: "#111827",
    fontWeight: "500",
  },
};

export default OrganizationDashboard;