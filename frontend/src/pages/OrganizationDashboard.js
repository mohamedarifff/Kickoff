import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrganizationDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("orgToken");

    if (!token) {
      navigate("/org/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    navigate("/org/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>🏢 Organization Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h3>Welcome to Kickoff</h3>
        <p>Your organization has been successfully approved.</p>

        <div style={styles.infoBox}>
          <p><strong>Status:</strong> Active</p>
          <p><strong>Access Level:</strong> Organization Admin</p>
        </div>

        <div style={styles.comingSoon}>
          🚀 League creation module coming next...
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  card: {
    background: "white",
    color: "#1e293b",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
  },
  infoBox: {
    marginTop: "15px",
    padding: "15px",
    background: "#f1f5f9",
    borderRadius: "10px",
  },
  comingSoon: {
    marginTop: "25px",
    padding: "15px",
    background: "#e0f2fe",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

export default OrganizationDashboard;