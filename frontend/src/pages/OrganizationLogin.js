import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizationLogin = ({ setOrgLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/org/login",
        { email, password }
      );

      localStorage.setItem("orgToken", res.data.token);
      setOrgLoggedIn(true);

      if (res.data.mustChangePassword) {
        navigate("/org/change-password");
      } else {
        navigate("/org/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Top Branding Bar */}
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% */}
        <div style={styles.leftPane}>
          <h2 style={styles.leftTitle}>
            Organization Portal
          </h2>
          <p style={styles.leftDesc}>
            Access your dashboard to manage leagues, teams,
            fixtures and real-time match updates.
          </p>
        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            
            <h2 style={styles.heading}>
              Organization Admin Login
            </h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

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
    fontWeight: "600",
  },

  layout: {
    display: "flex",
    height: "calc(100vh - 70px)",
  },

  leftPane: {
    width: "40%",
    padding: "70px",
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
    lineHeight: "1.6",
  },

  rightPane: {
    width: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "70%",
    background: "white",
    padding: "45px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  heading: {
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginBottom: "15px",
  },
};

export default OrganizationLogin;