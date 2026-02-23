import { useEffect, useState, useCallback } from "react";
import {
  fetchRequests,
  approveRequest,
  rejectRequest,
} from "../services/api";

const SupportDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRejectId, setSelectedRejectId] = useState(null);

  /* 🔥 Force full page background */
  useEffect(() => {
    document.body.style.backgroundColor = "#7AAACE";
    document.body.style.margin = "0";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchRequests(status);
      setRequests(res.data.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setMessage("");
    try {
      await approveRequest(id);
      setMessage("Organization approved successfully.");
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason) {
      alert("Please enter rejection reason");
      return;
    }

    setActionLoading(id);
    setMessage("");

    try {
      await rejectRequest(id, rejectionReason);
      setMessage("Organization rejected successfully.");
      setRejectionReason("");
      setSelectedRejectId(null);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supportToken");
    window.location.reload();
  };

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loaderCard}>Loading requests...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Top Branding Bar */}
      <div style={styles.topbar}>
        <div style={styles.brand}>Kickoff Support</div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.container}>
        {message && <div style={styles.successMsg}>{message}</div>}

        {/* Tabs */}
        <div style={styles.tabs}>
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                ...styles.tabBtn,
                ...(status === s ? styles.activeTab : {}),
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Requests */}
        <div style={styles.card}>
          {requests.length === 0 ? (
            <p style={styles.empty}>No {status} requests</p>
          ) : (
            <div style={styles.requestList}>
              {requests.map((req) => (
                <div key={req._id} style={styles.requestCard}>
                  <div style={styles.requestInfo}>
                    <h3 style={styles.orgName}>
                      {req.organizationName}
                    </h3>
                    <p style={styles.meta}><strong>Admin:</strong> {req.adminName}</p>
                    <p style={styles.meta}><strong>Email:</strong> {req.adminEmail}</p>
                    <p style={styles.meta}><strong>Type:</strong> {req.organizationType}</p>

                    {status === "rejected" && (
                      <p style={styles.rejectReason}>
                        <strong>Reason:</strong> {req.rejectionReason || "-"}
                      </p>
                    )}
                  </div>

                  <div style={styles.actionSection}>
                    <span style={badgeStyle(req.status)}>
                      {req.status.toUpperCase()}
                    </span>

                    {status === "pending" && (
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.approveBtn}
                          disabled={actionLoading === req._id}
                          onClick={() => handleApprove(req._id)}
                        >
                          {actionLoading === req._id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          style={styles.rejectBtn}
                          onClick={() =>
                            setSelectedRejectId(req._id)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {selectedRejectId === req._id && (
                      <div style={styles.rejectBox}>
                        <textarea
                          placeholder="Enter rejection reason..."
                          value={rejectionReason}
                          onChange={(e) =>
                            setRejectionReason(e.target.value)
                          }
                          style={styles.textarea}
                        />
                        <button
                          style={styles.confirmRejectBtn}
                          onClick={() =>
                            handleReject(req._id)
                          }
                        >
                          Confirm Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Badge */
const badgeStyle = (status) => {
  const colors = {
    pending: "#facc15",
    approved: "#22c55e",
    rejected: "#ef4444",
  };
  return {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    background: colors[status],
    fontWeight: "600",
  };
};

/* Styles */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#7AAACE",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "40px",   // 🔥 prevents bottom beige
    fontFamily: "Poppins, sans-serif",
  },

  topbar: {
    height: "70px",
    background: "#355872",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    color: "white",
  },

  brand: {
    fontSize: "20px",
    fontWeight: "600",
  },

  logoutBtn: {
    background: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "#355872",
    fontWeight: "600",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "0 20px",
    width: "100%",
  },

  successMsg: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  tabs: {
    marginBottom: "25px",
  },

  tabBtn: {
    padding: "10px 18px",
    marginRight: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#e2e8f0",
    color: "#355872",
    fontWeight: "500",
  },

  activeTab: {
    background: "#355872",
    color: "white",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
  },

  requestList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  requestCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px",
    borderRadius: "14px",
    background: "#f8fafc",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  requestInfo: {
    flex: 1,
  },

  orgName: {
    margin: "0 0 10px 0",
    color: "#355872",
  },

  meta: {
    margin: "4px 0",
    fontSize: "14px",
    color: "#334155",
  },

  rejectReason: {
    marginTop: "8px",
    color: "#b91c1c",
    fontSize: "14px",
  },

  actionSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
  },

  actionButtons: {
    display: "flex",
    gap: "10px",
  },

  approveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  rejectBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  rejectBox: {
    marginTop: "10px",
    background: "white",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
  },

  confirmRejectBtn: {
    background: "#991b1b",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  loaderCard: {
    margin: "auto",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    fontSize: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
};

export default SupportDashboard;