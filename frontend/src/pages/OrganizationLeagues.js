import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../utils/api";

import OrgLayout from "../components/layout/OrgLayout";

const OrganizationLeagues = () => {

  const navigate = useNavigate();

  const [leagues, setLeagues] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
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

    fetchLeagues();

  }, [navigate]);

  /* =====================================
     FETCH LEAGUES
  ===================================== */

  const fetchLeagues =
    async () => {

      try {

        setError("");

        const res =
          await API.get(
            "/leagues"
          );

        setLeagues(
          res.data.leagues || []
        );

      } catch (error) {

        console.error(
          "Failed to fetch leagues",
          error
        );

        setError(

          error.response?.data
            ?.message ||

          "Failed to load leagues"

        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <OrgLayout title="Leagues">

      {/* TOP ACTION BAR */}
      <div style={styles.topSection}>

        <div>

          <div style={styles.subHeading}>
            Manage football competitions
          </div>

          <h2 style={styles.heading}>
            Organization Leagues
          </h2>

        </div>

        <button
          style={styles.createBtn}
          onClick={() =>
            navigate(
              "/org/leagues/create"
            )
          }
        >
          Create League
        </button>

      </div>

      {/* ERROR */}
      {error && (

        <div style={styles.errorBox}>
          {error}
        </div>

      )}

      {/* CONTENT */}
      {loading ? (

        <div style={styles.placeholder}>
          Loading leagues...
        </div>

      ) : leagues.length === 0 ? (

        <div style={styles.emptyCard}>

          <div style={styles.emptyTitle}>
            No leagues created yet
          </div>

          <div style={styles.emptyText}>
            Start by creating your first football league.
          </div>

          <button
            style={styles.emptyBtn}
            onClick={() =>
              navigate(
                "/org/leagues/create"
              )
            }
          >
            Create First League
          </button>

        </div>

      ) : (

        <div style={styles.grid}>

          {leagues.map(
            (league) => (

              <div
                key={league._id}
                style={styles.card}
              >

                {/* CARD HEADER */}
                <div style={styles.cardTop}>

                  {league.logo ? (

                    <img
                      src={league.logo}
                      alt={league.name}
                      style={styles.logo}
                    />

                  ) : (

                    <div style={styles.logoPlaceholder}>
                      {league.name?.charAt(0)}
                    </div>

                  )}

                  <div>

                    <div style={styles.leagueName}>
                      {league.name}
                    </div>

                    <div style={styles.season}>
                      {league.season}
                    </div>

                  </div>

                </div>

                {/* DETAILS */}
                <div style={styles.details}>

                  <div style={styles.detailRow}>

                    <span style={styles.label}>
                      Format
                    </span>

                    <span style={styles.value}>
                    {league.format
                      ?.replaceAll("_", " ")
                      ?.replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )}
                    </span>

                  </div>

                  <div style={styles.detailRow}>

                    <span style={styles.label}>
                      Teams
                    </span>

                    <span style={styles.value}>
                      {league.numberOfTeams}
                    </span>

                  </div>

                  <div style={styles.detailRow}>

                    <span style={styles.label}>
                      Status
                    </span>

                    <span style={styles.status}>
                      {league.status}
                    </span>

                  </div>

                </div>

                {/* ACTION */}
                <button
                  style={styles.manageBtn}
                  onClick={() =>
                    navigate(
                      `/org/leagues/${league._id}`
                    )
                  }
                >
                  Manage League
                </button>

              </div>

            )
          )}

        </div>

      )}

    </OrgLayout>
  );
};

const styles = {

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  subHeading: {
    color: "#64748b",
    marginBottom: "8px",
    fontSize: "14px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a",
  },

  createBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(22,163,74,0.25)",
  },

  placeholder: {
    background: "white",
    padding: "30px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "16px",
    borderRadius: "14px",
    marginBottom: "22px",
    fontWeight: "500",
  },

  emptyCard: {
    background: "white",
    borderRadius: "28px",
    padding: "60px",
    textAlign: "center",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  emptyTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#0f172a",
  },

  emptyText: {
    color: "#64748b",
    marginBottom: "28px",
    fontSize: "15px",
  },

  emptyBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },

  card: {
    background: "white",
    borderRadius: "28px",
    padding: "28px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "30px",
  },

  logo: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "18px",
  },

  logoPlaceholder: {
    width: "70px",
    height: "70px",
    borderRadius: "18px",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "26px",
  },

  leagueName: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  season: {
    color: "#64748b",
    fontSize: "14px",
  },

  details: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "30px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#64748b",
    fontSize: "14px",
  },

  value: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: "14px",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
  },

  manageBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

};

export default OrganizationLeagues;