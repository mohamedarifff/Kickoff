import { useEffect, useState, useCallback } from "react";
import {
  fetchRequests,
  approveRequest,
  rejectRequest,
} from "../services/api";

const SupportDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending"); // ✅ NEW

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchRequests(status); // ✅ USE STATUS
      setRequests(res.data.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const handleApprove = async (id) => {
    await approveRequest(id);
    loadRequests(); // reload after action
  };

  const handleReject = async (id) => {
    await rejectRequest(id);
    loadRequests(); // reload after action
  };

  const handleLogout = () => {
    localStorage.removeItem("supportToken");
    window.location.reload();
  };

  // 🔁 reload when status changes
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Support Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      {/* ✅ FILTER BUTTONS */}
      <div style={{ marginTop: "15px", marginBottom: "15px" }}>
        <button onClick={() => setStatus("pending")}>Pending</button>
        <button onClick={() => setStatus("approved")}>Approved</button>
        <button onClick={() => setStatus("rejected")}>Rejected</button>
      </div>

      {requests.length === 0 ? (
        <p>No {status} requests</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Admin</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
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
                  {status === "pending" ? (
                    <>
                      <button onClick={() => handleApprove(req._id)}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(req._id)}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{req.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupportDashboard;
