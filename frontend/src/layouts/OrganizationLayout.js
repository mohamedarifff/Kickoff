import { useNavigate } from "react-router-dom";

const OrganizationLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    navigate("/org/login");
  };

  return (
    <div style={styles.page}>
      
      {/* 🔹 Top Branding Bar */}
      <div style={styles.topbar}>
        <div style={styles.brand}>Kickoff</div>

        <div style={styles.nav}>
          <span onClick={() => navigate("/org/dashboard")}>
            Dashboard
          </span>
          <span onClick={() => navigate("/org/leagues")}>
            Leagues
          </span>
          <span onClick={handleLogout}>
            Logout
          </span>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div style={styles.content}>
        {children}
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
  },

  brand: {
    fontSize: "22px",
    fontWeight: "600",
  },

  nav: {
    display: "flex",
    gap: "25px",
    cursor: "pointer",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 20px",
  },
};

export default OrganizationLayout;