import { useNavigate } from "react-router-dom";

const OrgLayout = ({
  children,
  title = "Dashboard",
}) => {

  const navigate =
    useNavigate();

  const handleLogout = () => {

    localStorage.removeItem(
      "orgToken"
    );

    navigate("/org/login");

  };

  return (

    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <div>

          {/* LOGO */}
          <div style={styles.logo}>
            Kickoff
          </div>

          {/* MENU */}
          <div style={styles.menu}>

            {/* DASHBOARD */}
            <div
              style={styles.menuItem}
              onClick={() =>
                navigate(
                  "/org/dashboard"
                )
              }
            >
              Dashboard
            </div>

            {/* LEAGUES */}
            <div
              style={styles.menuItem}
              onClick={() =>
                navigate(
                  "/org/leagues"
                )
              }
            >
              Leagues
            </div>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>

            <div style={styles.subtitle}>
              Organization Panel
            </div>

            <h1 style={styles.title}>
              {title}
            </h1>

          </div>

        </div>

        {/* CONTENT */}
        {children}

      </div>

    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    fontFamily:
      "Poppins, sans-serif",
  },

  sidebar: {
    width: "270px",
    background:
      "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "white",
    padding: "30px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent:
      "space-between",
    boxShadow:
      "8px 0 30px rgba(15,23,42,0.08)",
  },

  logo: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "52px",
    letterSpacing: "-1px",
    color: "white",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  menuItem: {
    padding: "15px 18px",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#cbd5e1",
    transition: "0.2s",
    fontWeight: "500",
    background:
      "rgba(255,255,255,0.02)",
  },

  logoutBtn: {
    padding: "15px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(to right, #dc2626, #b91c1c)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(220,38,38,0.22)",
  },

  main: {
    flex: 1,
    padding: "42px",
  },

  header: {
    marginBottom: "42px",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: "500",
  },

  title: {
    fontSize: "40px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "800",
    letterSpacing: "-1px",
  },

};

export default OrgLayout;