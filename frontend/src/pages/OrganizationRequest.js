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
      <div style={styles.card}>
        <h2 style={styles.title}>⚽ Register Organization</h2>
        <p style={styles.subtitle}>
          Submit your request to create a football league
        </p>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
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
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "420px",
    padding: "30px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "14px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default OrganizationRequest;