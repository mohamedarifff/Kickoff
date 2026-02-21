import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("supportToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// -------- API calls --------

export const fetchRequests = (status) =>
  API.get(`/organization-requests${status ? `?status=${status}` : ""}`);

export const approveRequest = (id) =>
  API.patch(`/organization-requests/${id}/approve`);

export const rejectRequest = (id, reason) =>
  API.patch(`/organization-requests/${id}/reject`, { reason });
