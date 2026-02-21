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

      // Store token
      localStorage.setItem("supportToken", res.data.token);

      // Update login state
      setIsLoggedIn(true);

      // Redirect to dashboard
      navigate("/support/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>⚽ Kickoff Support</h2>
        <p style={styles.subtitle}>Admin Access Portal</p>

        {error && <p style={styles.error}>{error}</p>}

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
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "380px",
    padding: "35px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0px 15px 40px rgba(0,0,0,0.25)",
  },
  title: {
    textAlign: "center",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#64748b",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
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
    background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "bold",
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