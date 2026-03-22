import axios from "axios";

const API = axios.create({
  baseURL: "https://enquiry-msoj.onrender.com/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — logout if token expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser     = (data) => API.post("/auth/login", data);
export const registerUser  = (data) => API.post("/auth/register", data);
export const getMe         = ()     => API.get("/auth/me");

// ── Enquiries ─────────────────────────────────────────────────────────────────
export const getEnquiries  = (params) => API.get("/enquiries", { params });
export const getEnquiry    = (id)     => API.get(`/enquiries/${id}`);
export const getStats      = ()       => API.get("/enquiries/stats");
export const createEnquiry = (data)   => API.post("/enquiries", data);
export const updateStatus  = (id, status) => API.put(`/enquiries/${id}/status`, { status });
export const addFollowUp   = (id, note)   => API.post(`/enquiries/${id}/followup`, { note });
export const deleteEnquiry = (id)     => API.delete(`/enquiries/${id}`);

// ── Users (Admin) ─────────────────────────────────────────────────────────────
export const getUsers      = ()       => API.get("/users");
export const createUser    = (data)   => API.post("/users", data);
export const deleteUser    = (id)     => API.delete(`/users/${id}`);

export default API;
