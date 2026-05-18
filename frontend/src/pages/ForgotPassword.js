import { useState } from "react";
import API from "../utils/api";

import {
  useNavigate,
  Link,
} from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (loading) return;

      setLoading(true);

      setError("");

      setSuccess("");

      try {

        const res =
          await API.post(
            "/org/forgot-password",
            { email }
          );

        setSuccess(
          res.data.message
        );

        setTimeout(() => {

          navigate(
            "/org/reset-password",
            {
              state: { email },
            }
          );

        }, 1500);

      } catch (err) {

        setError(

          err.response?.data
            ?.message ||

          "Failed to send reset code"

        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div style={styles.page}>

      {/* LEFT */}
      <div style={styles.leftPanel}>

        <div style={styles.overlay}></div>

        <div style={styles.leftContent}>

          <div style={styles.logo}>
            ⚽ Kickoff
          </div>

          <h1 style={styles.heroTitle}>
            Reset Your
            Organization
            Access.
          </h1>

          <p style={styles.heroText}>
            Securely recover your organization
            dashboard access using your
            registered email address.
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div style={styles.rightPanel}>

        <div style={styles.card}>

          <div style={styles.badge}>
            Password Recovery
          </div>

          <h2 style={styles.heading}>
            Forgot Password
          </h2>

          <p style={styles.subText}>
            Enter your registered organization email.
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.successBox}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                placeholder="organization@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                style={styles.input}
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity:
                  loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Sending Code..."
                : "Send Reset Code"}
            </button>

          </form>

          <div style={styles.bottomRow}>

            <Link
              to="/org/login"
              style={styles.backLink}
            >
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Poppins, sans-serif",
    background: "#0f172a",
  },

  leftPanel: {
    width: "55%",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1400&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "70px",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom right, rgba(15,23,42,0.9), rgba(22,163,74,0.5))",
  },

  leftContent: {
    position: "relative",
    zIndex: 2,
    color: "white",
    maxWidth: "520px",
  },

  logo: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "40px",
  },

  heroTitle: {
    fontSize: "58px",
    lineHeight: "1.05",
    marginBottom: "24px",
    fontWeight: "700",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.8",
    opacity: 0.92,
  },

  rightPanel: {
    width: "45%",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    background: "white",
    padding: "50px",
    borderRadius: "28px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.12)",
  },

  badge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "25px",
  },

  heading: {
    fontSize: "38px",
    marginBottom: "10px",
    color: "#0f172a",
  },

  subText: {
    color: "#64748b",
    marginBottom: "35px",
    fontSize: "15px",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  inputGroup: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.35)",
  },

  bottomRow: {
    marginTop: "24px",
    textAlign: "center",
  },

  backLink: {
    textDecoration: "none",
    color: "#16a34a",
    fontWeight: "600",
  },
};

export default ForgotPassword;