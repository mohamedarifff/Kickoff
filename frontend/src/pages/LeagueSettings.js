import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const LeagueSettings = () => {

  const { leagueId } =
    useParams();

  const navigate =
    useNavigate();

  const [league, setLeague] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      season: "",
      format: "",
      status: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [deleteText, setDeleteText] =
    useState("");

  useEffect(() => {

    const token =
      localStorage.getItem(
        "orgToken"
      );

    if (!token) {

      navigate("/org/login");

      return;

    }

    fetchLeague();

  }, [leagueId]);

  /* =========================
     FETCH LEAGUE
  ========================= */

  const fetchLeague =
    async () => {

      try {

        const res =
          await API.get(
            "/leagues"
          );

        const foundLeague =
          res.data.leagues.find(
            (l) =>
              l._id ===
              leagueId
          );

        if (!foundLeague) {

          setError(
            "League not found"
          );

          return;

        }

        setLeague(foundLeague);

        setForm({
          name:
            foundLeague.name || "",
          season:
            foundLeague.season || "",
          format:
            foundLeague.format || "",
          status:
            foundLeague.status || "",
        });

      } catch (error) {

        console.error(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to load league"

        );

      }
    };

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (
    e
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  /* =========================
     UPDATE LEAGUE
  ========================= */

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError("");

        setSuccess("");

        await API.put(
          `/leagues/${leagueId}`,
          form
        );

        setSuccess(
          "League updated successfully"
        );

        fetchLeague();

      } catch (error) {

        console.error(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to update league"

        );

      } finally {

        setLoading(false);

      }
    };

  /* =========================
     DELETE LEAGUE
  ========================= */

  const handleDelete =
    async () => {

      if (
        deleteText !==
        league.name
      ) {

        setError(
          "League name does not match"
        );

        return;

      }

      const confirmDelete =
        window.confirm(
          "Delete this league permanently?"
        );

      if (!confirmDelete)
        return;

      try {

        setLoading(true);

        await API.delete(
          `/leagues/${leagueId}`
        );

        navigate(
          "/org/leagues"
        );

      } catch (error) {

        console.error(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to delete league"

        );

      } finally {

        setLoading(false);

      }
    };

  if (!league)
    return null;

  return (
    <OrgLayout title="League Settings">

      {error && (

        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "16px",
          borderRadius: "16px",
          marginBottom: "24px",
          fontWeight: "600",
        }}>
          {error}
        </div>

      )}

      {success && (

        <div style={{
          background: "#dcfce7",
          color: "#166534",
          padding: "16px",
          borderRadius: "16px",
          marginBottom: "24px",
          fontWeight: "600",
        }}>
          {success}
        </div>

      )}

      {/* HEADER */}
      <div style={styles.hero}>

        <div>

          <div style={styles.heroTitle}>
            {league.name}
          </div>

          <div style={styles.heroMeta}>
            Manage league settings
          </div>

        </div>

        <button
          style={styles.backBtn}
          onClick={() =>
            navigate(
              `/org/leagues/${leagueId}`
            )
          }
        >
          ← Back
        </button>

      </div>

      {/* SETTINGS */}
      <div style={styles.card}>

        <div style={styles.sectionTitle}>
          League Information
        </div>

        <form
          onSubmit={
            handleUpdate
          }
        >

          {/* NAME */}
          <div style={styles.field}>

            <label style={styles.label}>
              League Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              style={styles.input}
            />

          </div>

          {/* SEASON */}
          <div style={styles.field}>

            <label style={styles.label}>
              Season
            </label>

            <input
              type="text"
              name="season"
              value={form.season}
              onChange={
                handleChange
              }
              style={styles.input}
            />

          </div>

          {/* FORMAT */}
          <div style={styles.field}>

            <label style={styles.label}>
              Format
            </label>

            <select
              name="format"
              value={form.format}
              onChange={
                handleChange
              }
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

          </div>

          {/* STATUS */}
          <div style={styles.field}>

            <label style={styles.label}>
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={
                handleChange
              }
              style={styles.input}
            >

              <option value="draft">
                Draft
              </option>

              <option value="active">
                Active
              </option>

              <option value="fixtures_generated">
                Fixtures Generated
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              ...styles.saveBtn,
              opacity:
                loading
                  ? 0.7
                  : 1,
            }}
            disabled={loading}
          >

            {loading

              ? "Saving..."

              : "Save Changes"}

          </button>

        </form>

      </div>

      {/* DELETE */}
      <div style={styles.deleteCard}>

        <div style={styles.deleteTitle}>
          Danger Zone
        </div>

        <div style={styles.deleteText}>
          Type the league name to permanently delete this league.
        </div>

        <input
          type="text"
          placeholder={league.name}
          value={deleteText}
          onChange={(e) =>
            setDeleteText(
              e.target.value
            )
          }
          style={styles.input}
        />

        <button
          style={styles.deleteBtn}
          onClick={
            handleDelete
          }
        >
          Delete League
        </button>

      </div>

    </OrgLayout>
  );
};

const styles = {

  hero: {
    background: "white",
    borderRadius: "28px",
    padding: "30px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "30px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  heroTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },

  heroMeta: {
    color: "#64748b",
  },

  backBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "white",
    borderRadius: "28px",
    padding: "34px",
    marginBottom: "30px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "28px",
  },

  field: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border:
      "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  saveBtn: {
    padding: "14px 24px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

  deleteCard: {
    background: "white",
    borderRadius: "28px",
    padding: "34px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
    border:
      "2px solid #fee2e2",
  },

  deleteTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: "14px",
  },

  deleteText: {
    color: "#64748b",
    marginBottom: "24px",
    lineHeight: "1.7",
  },

  deleteBtn: {
    marginTop: "20px",
    padding: "14px 24px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(to right, #dc2626, #b91c1c)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

};

export default LeagueSettings;