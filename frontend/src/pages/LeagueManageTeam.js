import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueManageTeam = () => {

  const { leagueId, teamId } = useParams();

  const navigate = useNavigate();

  const [team, setTeam] = useState(null);

  const [league, setLeague] = useState(null);

  const [form, setForm] = useState({
    name: "",
    coachName: "",
    logo: "",
  });

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
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

    fetchTeam(token);

    fetchLeague(token);

  }, []);

  const fetchTeam = async (token) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeam(res.data.team);

      setForm({
        name: res.data.team.name,
        coachName:
          res.data.team.coachName,
        logo: res.data.team.logo,
      });

      setPreview(
        res.data.team.logo
      );

    } catch (error) {

      console.error(error);

    }
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

    } catch (error) {

      console.error(error);

    }
  };

  const uploadLogo = async (file) => {

    if (!file) return;

    try {

      setUploading(true);

      setPreview(
        URL.createObjectURL(file)
      );

      const data =
        new FormData();

      data.append("file", file);

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

    } catch {

      setError(
        "Image upload failed"
      );

    } finally {

      setUploading(false);

    }
  };

  const removeLogo = () => {

    setPreview("");

    setForm((prev) => ({
      ...prev,
      logo: "",
    }));

    const fileInput =
      document.getElementById(
        "editLogoUpload"
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

  const handleUpdate =
    async () => {

      if (uploading) {

        setError(
          "Please wait for upload to finish."
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

        await axios.put(
          `http://localhost:5000/api/teams/${teamId}`,
          form,
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

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
            "Update failed"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete this team?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "orgToken"
          );

        await axios.delete(
          `http://localhost:5000/api/teams/${teamId}`,
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

      } catch {

        alert(
          "Delete failed"
        );

      }
    };

  if (!team || !league)
    return null;

  return (
    <OrgLayout title="Manage Team">

      {/* HERO */}
      <div style={styles.hero}>

        <div style={styles.heroLeft}>

          {preview ? (

            <img
              src={preview}
              alt="logo"
              style={styles.heroLogo}
            />

          ) : (

            <div
              style={
                styles.logoPlaceholder
              }
            >
              {team.name?.charAt(0)}
            </div>

          )}

          <div>

            <div style={styles.teamName}>
              {team.name}
            </div>

            <div style={styles.teamMeta}>
              {league.name}
            </div>

          </div>

        </div>

        <button
          style={styles.deleteBtn}
          onClick={handleDelete}
        >
          Delete Team
        </button>

      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* LEFT */}
        <div>

          <div style={styles.statsCard}>

            <div style={styles.sectionTitle}>
              Team Performance
            </div>

            <div style={styles.statsGrid}>

              <Stat
                value={team.played || 0}
                label="Played"
              />

              <Stat
                value={team.wins || 0}
                label="Wins"
              />

              <Stat
                value={team.draws || 0}
                label="Draws"
              />

              <Stat
                value={team.losses || 0}
                label="Losses"
              />

              <Stat
                value={team.goalsFor || 0}
                label="Goals For"
              />

              <Stat
                value={team.goalsAgainst || 0}
                label="Goals Against"
              />

            </div>

            <div style={styles.pointsBox}>
              {team.points || 0}
              <span style={styles.pointsText}>
                Points
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <div style={styles.card}>

            <div style={styles.sectionTitle}>
              Team Settings
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
                          "editLogoUpload"
                        )
                        .click()
                    }
                  >
                    {uploading
                      ? "Uploading..."
                      : "Choose File"}
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
                id="editLogoUpload"
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

            <button
              style={styles.saveBtn}
              onClick={
                handleUpdate
              }
              disabled={
                loading ||
                uploading
              }
            >

              {loading
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </div>

      </div>

    </OrgLayout>
  );
};

const Stat = ({
  value,
  label,
}) => (

  <div style={styles.statBox}>

    <div style={styles.statValue}>
      {value}
    </div>

    <div style={styles.statLabel}>
      {label}
    </div>

  </div>
);

const styles = {

  hero: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #111827 45%, #14532d 100%)",
    borderRadius: "36px",
    padding: "40px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "34px",
    color: "white",
    boxShadow:
      "0 25px 60px rgba(15,23,42,0.22)",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  heroLogo: {
    width: "110px",
    height: "110px",
    borderRadius: "28px",
    objectFit: "cover",
    boxShadow:
      "0 14px 35px rgba(0,0,0,0.18)",
  },

  logoPlaceholder: {
    width: "110px",
    height: "110px",
    borderRadius: "28px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    fontWeight: "800",
  },

  teamName: {
    fontSize: "40px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  teamMeta: {
    color: "#d1d5db",
    fontSize: "15px",
  },

  deleteBtn: {
    padding: "16px 24px",
    border: "none",
    borderRadius: "18px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(220,38,38,0.25)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1.5fr",
    gap: "30px",
  },

  statsCard: {
    background: "white",
    borderRadius: "34px",
    padding: "34px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.08)",
  },

  card: {
    background: "white",
    borderRadius: "34px",
    padding: "40px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.08)",
  },

  sectionTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "26px",
    color: "#0f172a",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "18px",
  },

  statBox: {
    background: "#f8fafc",
    borderRadius: "22px",
    padding: "24px",
    textAlign: "center",
  },

  statValue: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },

  pointsBox: {
    marginTop: "28px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    borderRadius: "24px",
    padding: "26px",
    textAlign: "center",
    color: "white",
    fontSize: "44px",
    fontWeight: "800",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  pointsText: {
    fontSize: "15px",
    fontWeight: "500",
    opacity: 0.9,
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
  },

  uploadBox: {
    border:
      "2px dashed #d1d5db",
    borderRadius: "28px",
    padding: "42px",
    textAlign: "center",
    background:
      "linear-gradient(to bottom, #f8fafc, #ffffff)",
  },

  preview: {
    width: "180px",
    height: "180px",
    borderRadius: "28px",
    objectFit: "cover",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.14)",
  },

  uploadPlaceholder: {
    color: "#64748b",
    marginBottom: "20px",
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

  saveBtn: {
    width: "100%",
    padding: "18px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "14px",
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

export default LeagueManageTeam;