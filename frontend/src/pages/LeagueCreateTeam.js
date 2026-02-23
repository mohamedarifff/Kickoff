import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LeagueCreateTeam = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [teamCount, setTeamCount] = useState(0);

  const [form, setForm] = useState({
    name: "",
    coachName: "",
    logo: "",
  });

  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("orgToken");
    if (!token) {
        navigate("/org/login");
        return;
    }
    fetchLeague(token);
    fetchTeams(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeague = async (token) => {
    const res = await axios.get(
      "http://localhost:5000/api/leagues",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const found = res.data.leagues.find(l => l._id === leagueId);
    setLeague(found);
  };

  const fetchTeams = async (token) => {
    const res = await axios.get(
      `http://localhost:5000/api/teams/league/${leagueId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTeamCount(res.data.teams.length);
  };

  const uploadLogo = async (file) => {
    if (!file) return;
  
    try {
      setUploading(true);
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
  
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Image upload failed");
    } finally{
        setUploading(false);
    }
  };

  const removeLogo = () => {
    setPreview("");
    setForm({ ...form, logo: "" });
  
    const fileInput = document.getElementById("logoUpload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (teamCount >= league.numberOfTeams) {
      setError("League capacity reached. Cannot add more teams.");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("orgToken");

    await axios.post(
        `http://localhost:5000/api/teams/league/${leagueId}`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/org/leagues/${leagueId}/teams`);
  };

  if (!league) return null;

  const isFull = teamCount >= league.numberOfTeams;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>Kickoff</div>

      <div style={styles.layout}>

        {/* LEFT 40% */}
        <div style={styles.leftPane}>
          <div style={styles.leagueCard}>
            {league.logo && (
              <img
                src={league.logo}
                alt="League Logo"
                style={styles.leagueLogo}
              />
            )}

            <h2>{league.name}</h2>
            <p><strong>Season:</strong> {league.season}</p>
            <p><strong>Format:</strong> {league.format}</p>
            <p>
              <strong>Teams:</strong> {teamCount} / {league.numberOfTeams}
            </p>

            {isFull && (
              <div style={styles.capacityFull}>
                League Capacity Reached
              </div>
            )}
          </div>

          <div style={styles.infoBox}>
            <h4>Team Creation Guidelines</h4>
            <ul style={styles.list}>
              <li>Team name must be unique.</li>
              <li>Logo should be square (recommended 500x500).</li>
              <li>Use official team identity.</li>
              <li>Coach name is optional.</li>
              <li>Stats initialize automatically.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT 60% */}
        <div style={styles.rightPane}>
          <div style={styles.card}>
            <h3>Create Team</h3>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Team Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Coach Name</label>
              <input
                name="coachName"
                value={form.coachName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>Upload Team Logo</label>

                <div style={styles.uploadRow}>
                    <button
                    type="button"
                    style={styles.uploadBtn}
                    onClick={() => document.getElementById("logoUpload").click()}
                    disabled={isFull}
                    >
                        Choose File
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
                    id="logoUpload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => uploadLogo(e.target.files[0])}
                />

                <p style={styles.logoNote}>
                    Logo must be square format (1:1 ratio).
                </p>

                {preview && (
                    <div style={styles.previewContainer}>
                        <img src={preview} alt="preview" style={styles.preview} />
                    </div>
                )}
            </div>

            <button
              style={styles.button}
              onClick={handleSubmit}
              disabled={loading || isFull || uploading}
            >
              {uploading
                ? "Uploading Logo..."
                : isFull
                ? "Capacity Full"
                : loading
                ? "Creating..."
                : "Create Team"}

                
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
  leftPane: { width: "40%", padding: "0 60px" },
  rightPane: { width: "60%", paddingRight: "60px" },

  leagueCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },
  leagueLogo: { width: "120px", marginBottom: "15px" },

  capacityFull: {
    marginTop: "10px",
    padding: "8px",
    background: "#fee2e2",
    borderRadius: "6px",
    color: "#991b1b",
  },

  infoBox: {
    background: "white",
    padding: "20px",
    paddingBottom:"20px",
    borderRadius: "12px",
  },

  list: {
    listStyle: "disc",
    paddingLeft: "18px",
    lineHeight: "1.7",
    fontSize: "14px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
  },

  fieldGroup: { marginBottom: "20px" },
  label: { fontSize: "14px", marginBottom: "6px", display: "block" },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  uploadBtn: {
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  uploadRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },

  logoNote: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "6px",
  },

  previewContainer: {
    marginTop: "15px",
    textAlign: "center",
  },

  preview: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  removeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
};

export default LeagueCreateTeam;