import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MatchControl = () => {

  const { matchId } = useParams();

  const navigate = useNavigate();

  const [match, setMatch] = useState(null);

  const [delayReason, setDelayReason] =
    useState("");

  useEffect(() => {

    fetchMatch();

    const interval = setInterval(() => {
      fetchMatch();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchMatch = async () => {

    try {

      const token =
        localStorage.getItem("orgToken");

      const res = await axios.get(
        `http://localhost:5000/api/matches/${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatch(res.data.match);

      setDelayReason(
        res.data.match.delayReason || ""
      );

    } catch (error) {

      console.log(
        "Failed to fetch match"
      );

    }
  };

  /* =========================
     TIMER
  ========================= */

  const getLiveMinute = () => {

    if (!match) return "";

    if (match.status === "half-time") {
      return "45'";
    }

    if (match.status === "completed") {
      return "90'";
    }

    if (match.status !== "live") {
      return "";
    }

    const now = new Date();

    let minutes = 0;

    if (
      match.currentHalf === 1 &&
      match.firstHalfStart
    ) {

      const start = new Date(
        match.firstHalfStart
      );

      minutes = Math.floor(
        (
          now -
          start -
          (match.totalPausedDuration || 0)
        ) / 60000
      );

      if (minutes > 45) {
        minutes = 45;
      }

    }

    if (
      match.currentHalf === 2 &&
      match.secondHalfStart
    ) {

      const start = new Date(
        match.secondHalfStart
      );

      const secondHalfMinutes =
        Math.floor(
          (
            now -
            start -
            (match.totalPausedDuration || 0)
          ) / 60000
        );

      minutes = 45 + secondHalfMinutes;

      if (minutes > 90) {
        minutes = 90;
      }

    }

    return `${minutes}'`;

  };

  /* =========================
     STATUS
  ========================= */

  const getStatus = () => {

    if (!match) return "";

    if (match.isDelayed) {
      return "DELAYED";
    }

    if (match.status === "live") {
      return "LIVE";
    }

    if (match.status === "paused") {
      return "PAUSED";
    }

    if (match.status === "half-time") {
      return "HALF TIME";
    }

    if (match.status === "completed") {
      return "COMPLETED";
    }

    return "SCHEDULED";

  };

  /* =========================
     API CALL
  ========================= */

  const callApi = async (
    url,
    body = {}
  ) => {

    try {

      const token =
        localStorage.getItem("orgToken");

      await axios.put(
        url,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMatch();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Action failed"
      );

    }
  };

  /* =========================
     MATCH ACTIONS
  ========================= */

  const startMatch = () => {

    callApi(
      `http://localhost:5000/api/matches/start/${matchId}`
    );

  };

  const pauseMatch = () => {

    callApi(
      `http://localhost:5000/api/matches/pause/${matchId}`
    );

  };

  const resumeMatch = () => {

    callApi(
      `http://localhost:5000/api/matches/resume/${matchId}`
    );

  };

  const halfTime = () => {

    callApi(
      `http://localhost:5000/api/matches/halftime/${matchId}`
    );

  };

  const secondHalf = () => {

    callApi(
      `http://localhost:5000/api/matches/secondhalf/${matchId}`
    );

  };

  const endMatch = () => {

    callApi(
      `http://localhost:5000/api/matches/end/${matchId}`
    );

  };

  const updateScore = async (
    home,
    away
  ) => {

    callApi(
      `http://localhost:5000/api/matches/score/${matchId}`,
      {
        homeScore: home,
        awayScore: away,
      }
    );

  };

  /* =========================
     DELAY CONTROL
  ========================= */

  const saveDelayReason = async () => {

    callApi(
      `http://localhost:5000/api/matches/delay/${matchId}`,
      {
        delayReason,
        isDelayed: true,
      }
    );

  };

  if (!match) return null;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <div style={styles.brand}>
          Kickoff
        </div>

        <button
          style={styles.backBtn}
          onClick={() =>
            navigate(
              `/org/matches-control`
            )
          }
        >
          Back
        </button>

      </div>

      {/* BODY */}
      <div style={styles.container}>

        {/* STATUS */}
        <div
          style={{
            ...styles.status,
            color:
              getStatus() === "LIVE"
                ? "#dc2626"
                : getStatus() === "DELAYED"
                ? "#d97706"
                : "#0f172a",
          }}
        >
          {getStatus()}
        </div>

        {/* MINUTE */}
        <div style={styles.minute}>
          {getLiveMinute()}
        </div>

        {/* MATCH CARD */}
        <div style={styles.card}>

          {/* HOME */}
          <div style={styles.teamSection}>

            {match.homeTeam?.logo ? (

              <img
                src={match.homeTeam.logo}
                alt=""
                style={styles.logo}
              />

            ) : (

              <div style={styles.logoPlaceholder}>
                {match.homeTeam?.name?.charAt(0)}
              </div>

            )}

            <h2>
              {match.homeTeam?.name}
            </h2>

            <div style={styles.scoreBtns}>

              <button
                style={styles.scoreBtn}
                onClick={() =>
                  updateScore(
                    match.homeScore + 1,
                    match.awayScore
                  )
                }
              >
                +
              </button>

              <button
                style={styles.scoreBtn}
                onClick={() =>
                  updateScore(
                    Math.max(
                      match.homeScore - 1,
                      0
                    ),
                    match.awayScore
                  )
                }
              >
                -
              </button>

            </div>

          </div>

          {/* SCORE */}
          <div style={styles.center}>

            <div style={styles.score}>
              {match.homeScore}
            </div>

            <div style={styles.vs}>
              -
            </div>

            <div style={styles.score}>
              {match.awayScore}
            </div>

          </div>

          {/* AWAY */}
          <div style={styles.teamSection}>

            {match.awayTeam?.logo ? (

              <img
                src={match.awayTeam.logo}
                alt=""
                style={styles.logo}
              />

            ) : (

              <div style={styles.logoPlaceholder}>
                {match.awayTeam?.name?.charAt(0)}
              </div>

            )}

            <h2>
              {match.awayTeam?.name}
            </h2>

            <div style={styles.scoreBtns}>

              <button
                style={styles.scoreBtn}
                onClick={() =>
                  updateScore(
                    match.homeScore,
                    match.awayScore + 1
                  )
                }
              >
                +
              </button>

              <button
                style={styles.scoreBtn}
                onClick={() =>
                  updateScore(
                    match.homeScore,
                    Math.max(
                      match.awayScore - 1,
                      0
                    )
                  )
                }
              >
                -
              </button>

            </div>

          </div>

        </div>

        {/* DELAY BOX */}
        <div style={styles.delayBox}>

          <div style={styles.delayTitle}>
            Match Delay Control
          </div>

          <textarea
            value={delayReason}
            onChange={(e) =>
              setDelayReason(
                e.target.value
              )
            }
            placeholder="Enter delay reason..."
            style={styles.delayInput}
          />

          <button
            style={styles.delayBtn}
            onClick={saveDelayReason}
          >
            Save Delay Reason
          </button>

        </div>

        {/* CONTROLS */}
        <div style={styles.controls}>

          <button
            style={styles.controlBtn}
            onClick={startMatch}
          >
            Start Match
          </button>

          <button
            style={styles.controlBtn}
            onClick={pauseMatch}
          >
            Pause
          </button>

          <button
            style={styles.controlBtn}
            onClick={resumeMatch}
          >
            Resume
          </button>

          <button
            style={styles.controlBtn}
            onClick={halfTime}
          >
            Half Time
          </button>

          <button
            style={styles.controlBtn}
            onClick={secondHalf}
          >
            Start 2nd Half
          </button>

          <button
            style={styles.endBtn}
            onClick={endMatch}
          >
            End Match
          </button>

        </div>

      </div>

    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "Poppins",
  },

  header: {
    height: "80px",
    background:
      "linear-gradient(to right, #0f172a, #111827)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    color: "white",
  },

  brand: {
    fontSize: "28px",
    fontWeight: "700",
  },

  backBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  container: {
    padding: "40px",
    textAlign: "center",
  },

  status: {
    fontSize: "22px",
    fontWeight: "700",
  },

  minute: {
    fontSize: "42px",
    fontWeight: "700",
    marginTop: "14px",
    color: "#0f172a",
  },

  card: {
    marginTop: "40px",
    background: "white",
    borderRadius: "28px",
    padding: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  teamSection: {
    width: "30%",
  },

  logo: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  logoPlaceholder: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #16a34a, #15803d)",
    color: "white",
    fontSize: "36px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },

  center: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  score: {
    fontSize: "92px",
    fontWeight: "700",
    color: "#0f172a",
  },

  vs: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#64748b",
  },

  scoreBtns: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginTop: "24px",
  },

  scoreBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },

  delayBox: {
    marginTop: "34px",
    background: "white",
    padding: "28px",
    borderRadius: "24px",
    textAlign: "left",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.06)",
  },

  delayTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  delayInput: {
    width: "100%",
    minHeight: "120px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "16px",
    fontFamily: "Poppins",
    resize: "none",
    boxSizing: "border-box",
    fontSize: "14px",
  },

  delayBtn: {
    marginTop: "18px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    background: "#d97706",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  controls: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  controlBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  endBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

};

export default MatchControl;