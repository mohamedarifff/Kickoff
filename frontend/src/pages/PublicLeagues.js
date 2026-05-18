import { useEffect, useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../utils/api";

const PublicLeagues = () => {

  const navigate =
    useNavigate();

  const [leagues, setLeagues] =
    useState([]);

  const [liveMatches, setLiveMatches] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

    useEffect(() => {

        fetchLeagues();
      
        // AUTO REFRESH
        const interval =
          setInterval(() => {
      
            fetchLeagues();
      
          }, 15000);
      
        return () =>
          clearInterval(interval);
      
      }, []);

  /* =========================
     FETCH LEAGUES
  ========================= */

  const fetchLeagues =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/public/leagues"
          );

        setLeagues(
          res.data.leagues || []
        );

        // FETCH LIVE MATCHES
        const liveRes =
        await API.get(
          "/matches/public/live"
        );
      
      const sortedLive =
        (
          liveRes.data
            .matches || []
        ).sort(
          (a, b) =>
            new Date(
              b.updatedAt
            ) -
            new Date(
              a.updatedAt
            )
        );
      
      setLiveMatches(
        sortedLive
      );

      } catch (error) {

        console.error(error);

        setError(
          "Failed to fetch leagues"
        );

      } finally {

        setLoading(false);

      }
    };

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredLeagues =
    leagues.filter((league) =>
      league.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div style={styles.page}>

      {/* BACKGROUND GLOW */}
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      {/* TOPBAR */}
      <div style={styles.topbar}>

        <div
          style={styles.brand}
          onClick={() =>
            navigate("/")
          }
        >
          ⚽ Kickoff
        </div>

        <button
          style={styles.backBtn}
          onClick={() =>
            navigate("/")
          }
        >
          ← Home
        </button>

      </div>

      {/* HERO */}
      <div style={styles.hero}>

        <div style={styles.heroBadge}>
          LIVE FOOTBALL PLATFORM
        </div>

        <h1 style={styles.title}>
          Explore Public Leagues
        </h1>

        <p style={styles.subtitle}>
          Browse football leagues, view standings,
          follow fixtures, and watch live score
          updates in real time.
        </p>

        {/* SEARCH */}
        <div style={styles.searchWrap}>

          <input
            type="text"
            placeholder="Search leagues..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={styles.search}
          />

        </div>

      </div>

      {/* LIVE MATCHES */}
      {liveMatches.length > 0 && (

        <div style={styles.liveSection}>

          <div style={styles.liveTitle}>
            🔴 Live Matches
          </div>

          <div style={styles.liveGrid}>

            {liveMatches.map((match) => (

              <div
                key={match._id}
                style={styles.liveCard}
                onClick={() =>
                  navigate(
                    `/league/${match.leagueId?._id}`
                  )
                }
              >

                <div style={styles.liveTop}>

                  <div style={styles.liveBadge}>
                    LIVE
                  </div>

                  <div style={styles.liveLeague}>
                    {match.leagueId?.name}
                  </div>

                </div>

                <div style={styles.liveTeams}>

                  <div style={styles.liveTeam}>
                    {match.homeTeam?.name}
                  </div>

                  <div style={styles.liveScore}>
                    {match.homeScore} - {match.awayScore}
                  </div>

                  <div style={styles.liveTeam}>
                    {match.awayTeam?.name}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* ERROR */}
      {error && (

        <div style={styles.error}>
          {error}
        </div>

      )}

      {/* LOADING */}
      {loading ? (

        <div style={styles.loading}>
          Loading leagues...
        </div>

      ) : (

        <div style={styles.grid}>

          {filteredLeagues.length ===
          0 ? (

            <div style={styles.empty}>
              No leagues found
            </div>

          ) : (

            filteredLeagues.map(
              (league) => (

                <div
                  key={
                    league._id
                  }
                  style={
                    styles.card
                  }
                  onClick={() =>
                    navigate(
                      `/league/${league._id}`
                    )
                  }
                >

                  {/* TOP */}
                  <div style={styles.cardTop}>

                    {/* LOGO */}
                    {league.logo ? (

                      <img
                        src={
                          league.logo
                        }
                        alt="logo"
                        style={
                          styles.logo
                        }
                      />

                    ) : (

                      <div style={
                        styles.placeholderLogo
                      }>
                        {league.name?.charAt(
                          0
                        )}
                      </div>

                    )}

                    <div style={styles.liveTag}>
                      PUBLIC
                    </div>

                  </div>

                  {/* CONTENT */}
                  <div style={styles.cardBody}>

                    <h2 style={styles.cardTitle}>
                      {league.name}
                    </h2>

                    <p style={styles.season}>
                      {league.season}
                    </p>

                    <div style={styles.bottomRow}>

                      <div style={styles.badge}>
                        {league.format
                          ?.replaceAll(
                            "_",
                            " "
                          )}
                      </div>

                      <div style={styles.viewBtn}>
                        View →
                      </div>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      )}

    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    background: "#020617",
    fontFamily:
      "Poppins, sans-serif",
    color: "white",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "60px",
  },

  glowOne: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background:
      "rgba(34,197,94,0.18)",
    filter: "blur(120px)",
    top: "-120px",
    left: "-120px",
    zIndex: 0,
  },

  glowTwo: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background:
      "rgba(59,130,246,0.12)",
    filter: "blur(120px)",
    bottom: "-120px",
    right: "-120px",
    zIndex: 0,
  },

  topbar: {
    height: "80px",
    background:
      "rgba(15,23,42,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "0 50px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(14px)",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
  },

  brand: {
    fontSize: "28px",
    fontWeight: "800",
    cursor: "pointer",
    letterSpacing: "-1px",
  },

  backBtn: {
    background:
      "rgba(255,255,255,0.06)",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },

  hero: {
    textAlign: "center",
    padding:
      "100px 20px 70px",
    position: "relative",
    zIndex: 2,
  },

  heroBadge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background:
      "rgba(34,197,94,0.12)",
    border:
      "1px solid rgba(34,197,94,0.25)",
    color: "#4ade80",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "26px",
  },

  title: {
    fontSize: "72px",
    fontWeight: "900",
    marginBottom: "24px",
    lineHeight: "1.05",
    letterSpacing: "-2px",
  },

  subtitle: {
    maxWidth: "760px",
    margin: "0 auto",
    color: "#94a3b8",
    lineHeight: "1.9",
    fontSize: "18px",
    marginBottom: "42px",
  },

  searchWrap: {
    maxWidth: "720px",
    margin: "0 auto",
  },

  search: {
    width: "100%",
    padding: "22px",
    borderRadius: "22px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    fontSize: "16px",
    background:
      "rgba(15,23,42,0.85)",
    color: "white",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.25)",
  },

  grid: {
    padding: "20px 80px 80px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    position: "relative",
    zIndex: 2,
  },

  card: {
    background:
      "linear-gradient(to bottom right, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
    borderRadius: "32px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.25s",
    border:
      "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.35)",
    backdropFilter: "blur(18px)",
  },

  cardTop: {
    padding: "32px 32px 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent:
      "space-between",
  },

  logo: {
    width: "110px",
    height: "110px",
    borderRadius: "28px",
    objectFit: "cover",
    boxShadow:
      "0 14px 30px rgba(0,0,0,0.25)",
  },

  placeholderLogo: {
    width: "110px",
    height: "110px",
    borderRadius: "28px",
    background:
      "linear-gradient(to right, #22c55e, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    color: "white",
    fontSize: "42px",
    fontWeight: "800",
    boxShadow:
      "0 16px 35px rgba(22,163,74,0.35)",
  },

  liveTag: {
    background:
      "rgba(34,197,94,0.12)",
    color: "#4ade80",
    padding: "10px 16px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    border:
      "1px solid rgba(34,197,94,0.18)",
  },

  cardBody: {
    padding: "30px 32px 34px",
  },

  cardTitle: {
    fontSize: "34px",
    marginBottom: "12px",
    fontWeight: "800",
    lineHeight: "1.2",
  },

  season: {
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "28px",
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "14px",
  },

  badge: {
    padding: "12px 18px",
    borderRadius: "999px",
    background:
      "rgba(59,130,246,0.12)",
    color: "#93c5fd",
    fontWeight: "600",
    textTransform:
      "capitalize",
    fontSize: "14px",
    border:
      "1px solid rgba(59,130,246,0.16)",
  },

  viewBtn: {
    color: "#4ade80",
    fontWeight: "700",
    fontSize: "15px",
  },

  loading: {
    padding: "120px",
    textAlign: "center",
    fontSize: "22px",
    color: "#94a3b8",
    position: "relative",
    zIndex: 2,
  },

  empty: {
    gridColumn:
      "1 / -1",
    background:
      "rgba(15,23,42,0.95)",
    padding: "70px",
    borderRadius: "28px",
    textAlign: "center",
    color: "#94a3b8",
    border:
      "1px solid rgba(255,255,255,0.06)",
  },

  error: {
    background: "#7f1d1d",
    color: "white",
    margin: "30px 80px",
    padding: "18px",
    borderRadius: "18px",
    position: "relative",
    zIndex: 2,
  },

  liveSection: {
    padding: "0 80px 30px",
    position: "relative",
    zIndex: 2,
  },

  liveTitle: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "24px",
  },

  liveGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
  },

  liveCard: {
    background:
      "linear-gradient(to right, #166534, #15803d)",
    borderRadius: "28px",
    padding: "28px",
    cursor: "pointer",
    boxShadow:
      "0 18px 40px rgba(22,101,52,0.35)",
  },

  liveTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  liveBadge: {
    background: "white",
    color: "#166534",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  liveLeague: {
    fontSize: "14px",
    fontWeight: "600",
    opacity: 0.9,
  },

  liveTeams: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "16px",
  },

  liveTeam: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: "18px",
  },

  liveScore: {
    fontSize: "42px",
    fontWeight: "900",
    minWidth: "120px",
    textAlign: "center",
  },

};

export default PublicLeagues;
