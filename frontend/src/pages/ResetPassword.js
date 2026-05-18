import { useState } from "react";

import API from "../utils/api";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

const ResetPassword = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const defaultEmail =
    location.state?.email || "";

  const [email, setEmail] =
    useState(defaultEmail);

  const [code, setCode] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (newPassword.length < 6) {

      return setError(
        "Password must be at least 6 characters"
      );

    }

    if (newPassword !== confirmPassword) {

      return setError(
        "Passwords do not match"
      );

    }

    setLoading(true);

    try {

      const res = await API.post(
        "/org/reset-password",
        {
          email,
          code,
          newPassword,
        }
      );

      setSuccess(res.data.message);

      setTimeout(() => {

        navigate("/org/login");

      }, 1800);

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "Password reset failed"

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
            Secure Your
            Organization
            Account.
          </h1>

          <p style={styles.heroText}>
            Verify your reset code and create
            a strong new password for your
            organization dashboard.
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div style={styles.rightPanel}>

        <div style={styles.card}>

          <div style={styles.badge}>
            Password Reset
          </div>

          <h2 style={styles.heading}>
            Reset Password
          </h2>

          <p style={styles.subText}>
            Enter the OTP sent to your email.
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

            {/* EMAIL */}
            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                style={styles.input}
              />

            </div>

            {/* OTP */}
            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Verification Code
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                required
                style={styles.input}
              />

            </div>

            {/* NEW PASSWORD */}
            <div style={styles.inputGroup}>

              <label style={styles.label}>
                New Password
              </label>

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

            </div>

            {/* CONFIRM */}
            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
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
      "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1400&auto=format&fit=crop')",
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
    marginBottom: "22px",
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

export default ResetPassword;