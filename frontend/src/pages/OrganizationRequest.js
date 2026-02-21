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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/organization-requests/request",
        form
      );

      setMessage("Request submitted successfully. Await approval.");

      setForm({
        organizationName: "",
        adminName: "",
        adminEmail: "",
        organizationType: "college",
        purpose: "",
      });
    } catch (err) {
      setMessage("Submission failed. Please check your details.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Register Organization</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          value={form.organizationName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="adminName"
          placeholder="Admin Name"
          value={form.adminName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="adminEmail"
          placeholder="Admin Email"
          value={form.adminEmail}
          onChange={handleChange}
          required
        />

        <select
          name="organizationType"
          value={form.organizationType}
          onChange={handleChange}
        >
          <option value="college">College</option>
          <option value="club">Club</option>
          <option value="local">Local</option>
        </select>

        <textarea
          name="purpose"
          placeholder="Purpose (min 10 characters)"
          value={form.purpose}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default OrganizationRequest;
