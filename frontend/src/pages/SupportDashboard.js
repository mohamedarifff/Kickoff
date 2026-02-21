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
      setMessage("Organization rejected and email sent.");
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

  if (loading)
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loaderCard}>Loading requests...</div>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2>⚽ Kickoff Support Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Message */}
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

      {/* Table */}
      <div style={styles.card}>
        {requests.length === 0 ? (
          <p style={{ textAlign: "center" }}>No {status} requests</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Admin</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                {status === "rejected" && <th>Reason</th>}
                {status === "pending" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.organizationName}</td>
                  <td>{req.adminName}</td>
                  <td>{req.adminEmail}</td>
                  <td>{req.organizationType}</td>
                  <td>
                    <span style={badgeStyle(req.status)}>
                      {req.status}
                    </span>
                  </td>

                  {status === "rejected" && (
                    <td>{req.rejectionReason || "-"}</td>
                  )}

                  {status === "pending" && (
                    <td>
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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const badgeStyle = (status) => {
  const colors = {
    pending: "#facc15",
    approved: "#22c55e",
    rejected: "#ef4444",
  };
  return {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    background: colors[status],
    fontWeight: "bold",
  };
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    marginBottom: "20px",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  successMsg: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  tabs: {
    marginBottom: "20px",
  },
  tabBtn: {
    padding: "10px 18px",
    marginRight: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
  },
  activeTab: {
    background: "#2563eb",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  approveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "8px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  rejectBox: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
  },
  confirmRejectBtn: {
    background: "#991b1b",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  loadingPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  loaderCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    fontSize: "18px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
  },
};

export default SupportDashboard;