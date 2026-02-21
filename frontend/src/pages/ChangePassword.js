import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("orgToken");

      await axios.patch(
        "http://localhost:5000/api/org/change-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password updated successfully. Redirecting...");

      setTimeout(() => {
        navigate("/org/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
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
          <h2 style={styles.leftTitle}>Security Update</h2>
          <p style={styles.leftDesc}>
            For security reasons, you must change your temporary password 
            before accessing your organization dashboard.
          </p>
        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            
            <h2 style={styles.heading}>Change Password</h2>

            {error && <div style={styles.error}>{error}</div>}
            {message && <div style={styles.success}>{message}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Updating..." : "Update Password"}
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
    background: "#2845D6",
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
    fontSize: "30px",
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
    padding: "40px",
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
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};

export default ChangePassword;