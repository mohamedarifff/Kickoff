import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const OrganizationCreateLeague = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    season: "",
    format: "round_robin",
    numberOfTeams: "",
    description: "",
  });

  const [logo, setLogo] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "orgToken"
      );

    if (!token) {

      navigate("/org/login");

    }

  }, [navigate]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleLogoChange = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setLogo(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (submitting) return;

      setSubmitting(true);

      setError("");

      setSuccess("");

      /* VALIDATIONS */

      if (!form.name.trim()) {

        setError(
          "League name is required"
        );

        setSubmitting(false);

        return;
      }

      if (!form.season.trim()) {

        setError(
          "Season is required"
        );

        setSubmitting(false);

        return;
      }

      if (
        Number(form.numberOfTeams) < 2
      ) {

        setError(
          "League must have at least 2 teams"
        );

        setSubmitting(false);

        return;
      }

      try {

        const formData =
          new FormData();

        formData.append(
          "name",
          form.name
        );

        formData.append(
          "season",
          form.season
        );

        formData.append(
          "format",
          form.format
        );

        formData.append(
          "numberOfTeams",
          form.numberOfTeams
        );

        formData.append(
          "description",
          form.description
        );

        if (logo) {

          formData.append(
            "logo",
            logo
          );

        }

        await API.post(
          "/leagues",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        setSuccess(
          "League created successfully 🎉"
        );

        setTimeout(() => {

          navigate(
            "/org/leagues"
          );

        }, 1200);

      } catch (err) {

        setError(

          err.response?.data
            ?.message ||

          "Failed to create league"

        );

      } finally {

        setSubmitting(false);

      }
    };

  return (

    <div style={styles.page}>

      {/* Top Bar */}
      <div style={styles.topbar}>
        Kickoff
      </div>

      <div style={styles.layout}>

        {/* LEFT SIDE */}
        <div style={styles.leftPane}>

          <h2 style={styles.leftTitle}>
            Create a New League
          </h2>

          <p style={styles.leftDesc}>
            Set up your league details,
            upload a logo, and configure
            the competition format.
          </p>

          <button
            style={styles.backBtn}
            onClick={() =>
              navigate("/org/leagues")
            }
          >
            ← Back to Leagues
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div style={styles.rightPane}>

          <div style={styles.card}>

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            {success && (
              <p style={styles.success}>
                {success}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
            >

              <input
                type="text"
                name="name"
                placeholder="League Name"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="text"
                name="season"
                placeholder="Season (e.g. 2026)"
                value={form.season}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <select
                name="format"
                value={form.format}
                onChange={handleChange}
                style={styles.input}
              >

                <option value="round_robin">
                  Round Robin
                </option>

                <option value="knockout">
                  Knockout
                </option>

                <option value="group_knockout">
                  Group Knockout
                </option>

              </select>

              <input
                type="number"
                name="numberOfTeams"
                placeholder="Number of Teams"
                value={form.numberOfTeams}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="League Description"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
              />

              {/* Logo Upload */}
              <div style={styles.logoSection}>

                <label style={styles.logoLabel}>
                  League Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />

                {preview && (

                  <img
                    src={preview}
                    alt="Logo Preview"
                    style={styles.preview}
                  />

                )}

              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity:
                    submitting
                      ? 0.6
                      : 1,
                  cursor:
                    submitting
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={submitting}
              >

                {submitting
                  ? "Creating..."
                  : "Create League"}

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
    fontFamily:
      "Poppins, sans-serif",
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
    paddingTop: "40px",
    paddingBottom: "60px",
  },

  leftPane: {
    width: "40%",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  leftTitle: {
    fontSize: "32px",
    marginBottom: "20px",
  },

  leftDesc: {
    fontSize: "16px",
    lineHeight: "1.6",
  },

  backBtn: {
    marginTop: "24px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    width: "fit-content",
  },

  rightPane: {
    width: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "80%",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "Poppins",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "90px",
    fontFamily: "Poppins",
  },

  logoSection: {
    marginBottom: "20px",
  },

  logoLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
  },

  preview: {
    marginTop: "10px",
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #ddd",
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
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },

  success: {
    color: "green",
    marginBottom: "10px",
  },
};

export default OrganizationCreateLeague;