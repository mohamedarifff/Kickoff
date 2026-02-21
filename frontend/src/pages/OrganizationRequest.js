import { useState } from "react";
import axios from "axios";

const OrganizationRequest = () => {
  const [form, setForm] = useState({
    organizationName: "",
    adminName: "",
    adminEmail: "",
    organizationType: "college",
    purpose: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/organization-requests/request",
        form
      );

      setMessage(res.data.message);

      setForm({
        organizationName: "",
        adminName: "",
        adminEmail: "",
        organizationType: "college",
        purpose: "",
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Top Branding */}
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% — Policies */}
        <div style={styles.leftPane}>
          <h2 style={styles.leftTitle}>Organization Approval Policy</h2>

          <ul style={styles.policyList}>
            <li>✔ Organization must represent a real football entity</li>
            <li>✔ Valid administrator email is required</li>
            <li>✔ Clear purpose of league management</li>
            <li>✔ No duplicate or spam registrations</li>
            <li>✔ Approval may take 24–48 hours</li>
          </ul>

          <p style={styles.note}>
            After approval, login credentials will be sent via email.
          </p>
        </div>

        {/* RIGHT 60% — Form */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Register Organization</h2>

            {message && <div style={styles.success}>{message}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="organizationName"
                placeholder="Organization Name"
                value={form.organizationName}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="text"
                name="adminName"
                placeholder="Admin Name"
                value={form.adminName}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="email"
                name="adminEmail"
                placeholder="Admin Email"
                value={form.adminEmail}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <select
                name="organizationType"
                value={form.organizationType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="college">College</option>
                <option value="club">Club</option>
                <option value="local">Local</option>
              </select>

              <textarea
                name="purpose"
                placeholder="Purpose (minimum 10 characters)"
                value={form.purpose}
                onChange={handleChange}
                required
                style={{ ...styles.input, height: "90px" }}
              />

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
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
    paddingTop: "40px",   // ✅ prevents overlap
    paddingBottom: "60px",
  },

  leftPane: {
    width: "40%",
    padding: "60px 70px",
  },

  leftTitle: {
    fontSize: "26px",
    marginBottom: "20px",
  },

  policyList: {
    lineHeight: "1.9",
    paddingLeft: "18px",
    marginBottom: "20px",
  },

  note: {
    marginTop: "20px",
    fontSize: "14px",
  },

  rightPane: {
    width: "60%",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "80%",        // ✅ better alignment
    maxWidth: "520px",
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
    boxSizing: "border-box",   // ✅ fixes width alignment
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    boxSizing: "border-box",   // ✅ ensures equal width
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};

export default OrganizationRequest;