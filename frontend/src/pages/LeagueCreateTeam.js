import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueCreateTeam = () => {

  const { leagueId } = useParams();

  const navigate = useNavigate();

  const [league, setLeague] =
    useState(null);

  const [teamCount, setTeamCount] =
    useState(0);

  const [form, setForm] = useState({
    name: "",
    coachName: "",
    logo: "",
  });

  const [uploading, setUploading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const token =
      localStorage.getItem("orgToken");

    if (!token) {

      navigate("/org/login");

      return;

    }

    fetchLeague(token);

    fetchTeams(token);

  }, []);

  const formatLabel = (
    value
  ) => {

    if (!value) return "";

    return value
      .replace(/[_-]/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );

  };

  const fetchLeague = async (token) => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/leagues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const found =
        res.data.leagues.find(
          (l) => l._id === leagueId
        );

      setLeague(found);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to fetch league"
      );

    }
  };

  const fetchTeams = async (token) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/teams/league/${leagueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeamCount(
        res.data.teams.length
      );

    } catch (err) {

      console.error(err);

    }
  };

  /* =========================
     CLOUDINARY UPLOAD
  ========================= */

  const uploadLogo = async (file) => {

    if (!file) return;

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        "Image must be under 5MB"
      );

      return;

    }

    try {

      setUploading(true);

      setError("");

      setPreview(
        URL.createObjectURL(file)
      );

      const compressedFile =
        await imageCompression(
          file,
          {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 500,
            useWebWorker: true,
          }
        );

      const data =
        new FormData();

      data.append(
        "file",
        compressedFile
      );

      data.append(
        "upload_preset",
        "kickoff_teams"
      );

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/da3nls68u/image/upload",
        data
      );

      setForm((prev) => ({
        ...prev,
        logo: res.data.secure_url,
      }));

    } catch (err) {

      console.error(err);

      setError(
        "Image upload failed"
      );

    } finally {

      setUploading(false);

    }
  };

  const removeLogo = () => {

    setPreview("");

    setForm({
      ...form,
      logo: "",
    });

    const fileInput =
      document.getElementById(
        "logoUpload"
      );

    if (fileInput) {

      fileInput.value = "";

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async () => {

      if (
        teamCount >=
        league.numberOfTeams
      ) {

        setError(
          "League capacity reached."
        );

        return;

      }

      if (
        !form.name.trim()
      ) {

        setError(
          "Team name is required"
        );

        return;

      }

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem(
            "orgToken"
          );

        await axios.post(
          `http://localhost:5000/api/teams/league/${leagueId}`,
          { ...form },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        navigate(
          `/org/leagues/${leagueId}/teams`
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data
            ?.message ||
            "Failed to create team"
        );

      } finally {

        setLoading(false);

      }
    };

  if (!league) return null;

  const isFull =
    teamCount >=
    league.numberOfTeams;

  return (
    <OrgLayout title="Create Team">

      {/* HERO */}
      <div style={styles.heroCard}>

        <div>

          <div style={styles.heroTitle}>
            {league.name}
          </div>

          <div style={styles.heroMeta}>
            {league.season}
            {" • "}
            {formatLabel(
              league.format
            )}
          </div>

        </div>

        <div style={styles.capacityBadge}>
          {teamCount}/
          {league.numberOfTeams} Teams
        </div>

      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* LEFT */}
        <div>

          <div style={styles.infoCard}>

            <div style={styles.infoTitle}>
              Team Creation Guidelines
            </div>

            <div style={styles.infoText}>
              Configure professional
              teams with logos,
              coaching staff and
              competition-ready setup.
            </div>

            <ul style={styles.list}>

              <li>
                Unique team names only
              </li>

              <li>
                Square logos recommended
              </li>

              <li>
                Coach name optional
              </li>

              <li>
                Images auto compressed
              </li>

            </ul>

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <div style={styles.card}>

            <div style={styles.formTitle}>
              Team Details
            </div>

            {error && (

              <div style={styles.error}>
                {error}
              </div>

            )}

            {/* TEAM NAME */}
            <div style={styles.fieldGroup}>

              <label style={styles.label}>
                Team Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                style={styles.input}
                placeholder="Enter team name"
              />

            </div>

            {/* COACH */}
            <div style={styles.fieldGroup}>

              <label style={styles.label}>
                Coach Name
              </label>

              <input
                name="coachName"
                value={
                  form.coachName
                }
                onChange={
                  handleChange
                }
                style={styles.input}
                placeholder="Optional"
              />

            </div>

            {/* LOGO */}
            <div style={styles.fieldGroup}>

              <label style={styles.label}>
                Team Logo
              </label>

              <div style={styles.uploadBox}>

                {preview ? (

                  <img
                    src={preview}
                    alt="preview"
                    style={
                      styles.preview
                    }
                  />

                ) : (

                  <div
                    style={
                      styles.uploadPlaceholder
                    }
                  >
                    Upload Team Logo
                  </div>

                )}

                <div
                  style={
                    styles.uploadActions
                  }
                >

                  <button
                    type="button"
                    style={
                      styles.uploadBtn
                    }
                    onClick={() =>
                      document
                        .getElementById(
                          "logoUpload"
                        )
                        .click()
                    }
                  >
                    Choose File
                  </button>

                  {preview && (

                    <button
                      type="button"
                      style={
                        styles.removeBtn
                      }
                      onClick={
                        removeLogo
                      }
                    >
                      Remove
                    </button>

                  )}

                </div>

              </div>

              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                style={{
                  display: "none",
                }}
                onChange={(e) =>
                  uploadLogo(
                    e.target.files[0]
                  )
                }
              />

            </div>

            {/* BUTTON */}
            <button
              style={styles.button}
              onClick={
                handleSubmit
              }
              disabled={
                loading ||
                uploading ||
                isFull
              }
            >

              {uploading
                ? "Uploading..."
                : loading
                ? "Creating Team..."
                : "Create Team"}

            </button>

          </div>

        </div>

      </div>

    </OrgLayout>
  );
};

const styles = {

  heroCard: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #111827 45%, #14532d 100%)",
    borderRadius: "36px",
    padding: "44px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "34px",
    boxShadow:
      "0 25px 60px rgba(15,23,42,0.22)",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },

  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "-1px",
    marginBottom: "12px",
  },

  heroMeta: {
    color: "#d1d5db",
    fontSize: "15px",
    letterSpacing: "0.3px",
  },

  capacityBadge: {
    padding: "14px 24px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.16)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.12)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1.5fr",
    gap: "28px",
  },

  infoCard: {
    background: "white",
    borderRadius: "34px",
    padding: "34px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.08)",
  },

  infoTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "18px",
    color: "#0f172a",
  },

  infoText: {
    color: "#64748b",
    lineHeight: "1.9",
    marginBottom: "24px",
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "2.2",
    color: "#475569",
  },

  card: {
    background: "white",
    borderRadius: "34px",
    padding: "40px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.08)",
    border:
      "1px solid #f1f5f9",
  },

  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#0f172a",
  },

  fieldGroup: {
    marginBottom: "26px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
    color: "#0f172a",
  },

  input: {
    width: "100%",
    padding: "17px",
    borderRadius: "18px",
    border:
      "1px solid #e2e8f0",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#f8fafc",
    fontFamily:
      "Poppins, sans-serif",
    transition: "0.2s",
  },

  uploadBox: {
    border:
      "2px dashed #d1d5db",
    borderRadius: "28px",
    padding: "46px",
    textAlign: "center",
    background:
      "linear-gradient(to bottom, #f8fafc, #ffffff)",
  },

  uploadPlaceholder: {
    color: "#64748b",
    marginBottom: "22px",
    fontSize: "15px",
  },

  uploadActions: {
    marginTop: "24px",
    display: "flex",
    justifyContent:
      "center",
    gap: "14px",
  },

  uploadBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.22)",
  },

  removeBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "16px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  preview: {
    width: "180px",
    height: "180px",
    borderRadius: "28px",
    objectFit: "cover",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.14)",
  },

  button: {
    width: "100%",
    padding: "19px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "16px",
    boxShadow:
      "0 14px 30px rgba(22,163,74,0.28)",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "22px",
    fontWeight: "500",
  },

};

export default LeagueCreateTeam;