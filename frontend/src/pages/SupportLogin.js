import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupportLogin = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/support/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      localStorage.setItem("supportToken", res.data.token);
      setIsLoggedIn(true);
      navigate("/support/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      {/* Branding Bar */}
      <div style={styles.topbar}>
        <div style={styles.brand} onClick={() => navigate("/")}>
          Kickoff Support
        </div>
      </div>

      <div style={styles.layout}>
        {/* LEFT 40% */}
        <div style={styles.leftPane}>
          <h1 style={styles.leftTitle}>Kickoff Support</h1>

          <p style={styles.leftText}>
            The Support Panel allows administrators to manage
            organization approvals, monitor leagues, and ensure
            tournaments run smoothly across the platform.
          </p>

          <p style={styles.leftText}>
            Secure access ensures only authorized personnel
            can control system-level operations.
          </p>

        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            <h2 style={styles.title}>Admin Login</h2>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Support Email"
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

              <button type="submit" style={styles.button}>
                Login Support
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#7AAACE",
    fontFamily: "Poppins, sans-serif",
  },

  topbar: {
    height: "70px",
    background: "#355872",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    color: "white",
  },

  brand: {
    fontSize: "22px",
    fontWeight: "600",
    cursor: "pointer",
  },

  layout: {
    display: "flex",
    height: "calc(100vh - 70px)",
  },

  /* LEFT 40% */
  leftPane: {
    width: "40%",
    padding: "80px 60px",
    color: "#1e293b",
  },

  leftTitle: {
    fontSize: "32px",
    marginBottom: "25px",
    color: "#355872",
  },

  leftText: {
    fontSize: "15px",
    lineHeight: "1.8",
    marginBottom: "20px",
  },

  /* RIGHT 60% */
  rightPane: {
    width: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "420px",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#355872",
  },

  input: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#355872",
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default SupportLogin;