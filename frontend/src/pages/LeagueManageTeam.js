import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("orgToken");
    if (!token) {
      navigate("/org/login");
      return;
    }

    fetchTeam(token);
    fetchLeague(token);
  }, []);

  const fetchTeam = async (token) => {
    const res = await axios.get(
      `http://localhost:5000/api/teams/${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTeam(res.data.team);

    setForm({
      name: res.data.team.name,
      coachName: res.data.team.coachName,
      logo: res.data.team.logo,
    });

    setPreview(res.data.team.logo);
  };

  const fetchLeague = async (token) => {
    const res = await axios.get(
      "http://localhost:5000/api/leagues",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const found = res.data.leagues.find(l => l._id === leagueId);
    setLeague(found);
  };

  const uploadLogo = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      // instant preview
      setPreview(URL.createObjectURL(file));

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "kickoff_teams");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/da3nls68u/image/upload",
        data
      );

      setForm(prev => ({
        ...prev,
        logo: res.data.secure_url,
      }));

    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setPreview("");
    setForm(prev => ({ ...prev, logo: "" }));

    const fileInput = document.getElementById("editLogoUpload");
    if (fileInput) fileInput.value = "";
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (uploading) {
      setError("Please wait for logo upload to finish.");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("orgToken");

    await axios.put(
      `http://localhost:5000/api/teams/${teamId}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/org/leagues/${leagueId}/teams`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("orgToken");

    await axios.delete(
      `http://localhost:5000/api/teams/${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/org/leagues/${leagueId}/teams`);
  };

  if (!team || !league) return null;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% */}
        <div style={styles.leftPane}>

          <div style={styles.teamCard}>
            {preview && (
              <img src={preview} alt="Team Logo" style={styles.logo} />
            )}

            <h2>{team.name}</h2>
            <p><strong>Coach:</strong> {team.coachName || "N/A"}</p>
            <p><strong>League:</strong> {league.name}</p>
          </div>

          <div style={styles.statsCard}>
            <h4>Team Statistics</h4>
            <p>Played: {team.played}</p>
            <p>Wins: {team.wins}</p>
            <p>Draws: {team.draws}</p>
            <p>Losses: {team.losses}</p>
            <p>Goals For: {team.goalsFor}</p>
            <p>Goals Against: {team.goalsAgainst}</p>
            <p><strong>Points: {team.points}</strong></p>
          </div>

          <button
            style={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete Team
          </button>

        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            <h3>Edit Team</h3>

            {error && <div style={styles.error}>{error}</div>}

            <label style={styles.label}>Team Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />

            <label style={styles.label}>Coach Name</label>
            <input
              name="coachName"
              value={form.coachName}
              onChange={handleChange}
              style={styles.input}
            />

            <label style={styles.label}>Change Logo</label>

            <div style={styles.uploadRow}>
              <button
                type="button"
                style={styles.uploadBtn}
                onClick={() =>
                  document.getElementById("editLogoUpload").click()
                }
              >
                {uploading ? "Uploading..." : "Choose File"}
              </button>

              {preview && (
                <button
                  type="button"
                  style={styles.removeBtn}
                  onClick={removeLogo}
                >
                  Remove
                </button>
              )}
            </div>

            <input
              id="editLogoUpload"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => uploadLogo(e.target.files[0])}
            />

            <button
              style={styles.saveBtn}
              onClick={handleUpdate}
              disabled={loading || uploading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

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
  },
  layout: { display: "flex", paddingTop: "40px" },

  leftPane: {
    width: "40%",
    padding: "0 60px",
    paddingBottom: "60px", // spacing from bottom
  },

  rightPane: {
    width: "60%",
    paddingRight: "60px",
  },

  teamCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },

  logo: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  statsCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  deleteBtn: {
    width: "100%",
    padding: "12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
  },

  label: {
    fontSize: "14px",
    marginTop: "10px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  uploadRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "10px",
  },

  uploadBtn: {
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  removeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  saveBtn: {
    width: "100%",
    padding: "12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
};

export default LeagueManageTeam;