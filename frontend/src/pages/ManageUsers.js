import { useState, useEffect } from "react";
import { getUsers, createUser, deleteUser } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ManageUsers({ setPage }) {
  const { user: currentUser } = useAuth();
  const [users,    setUsers]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");
  const [flash,    setFlash]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]    = useState({ name: "", email: "", password: "", role: "staff" });
  const [formErr,  setFormErr] = useState({});
  const [saving,   setSaving]  = useState(false);

  function showFlash(msg) { setFlash(msg); setTimeout(() => setFlash(""), 3000); }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  function set(key) { return e => setForm(f => ({ ...f, [key]: e.target.value })); }

  function validate() {
    const e = {};
    if (!form.name.trim())                e.name     = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Enter a valid email";
    if (form.password.length < 6)         e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleCreate() {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErr(errs); return; }
    setSaving(true);
    try {
      await createUser(form);
      showFlash(`User "${form.name}" created successfully!`);
      setForm({ name: "", email: "", password: "", role: "staff" });
      setFormErr({});
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      showFlash(`User "${name}" deleted.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? "Cancel" : "+ Add User"}
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("dashboard")}>← Dashboard</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {flash && <div className="alert alert-success">✅ {flash}</div>}

      {/* Add User Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
            New User
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={set("name")} placeholder="e.g. Sneha Gupta" className={formErr.name ? "error" : ""} />
              {formErr.name && <div className="error-msg">{formErr.name}</div>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="user@example.com" className={formErr.email ? "error" : ""} />
              {formErr.email && <div className="error-msg">{formErr.email}</div>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Min 6 characters" className={formErr.password ? "error" : ""} />
              {formErr.password && <div className="error-msg">{formErr.password}</div>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={set("role")}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating…" : "Create User"}
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : (
          <table>
            <thead>
              <tr>
                {["Name", "Email", "Role", "Joined", "Actions"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#94A3B8", padding: "3rem" }}>No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: u.role === "admin" ? "#7C3AED" : "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {u.name[0]}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                      {u._id === currentUser?.id && (
                        <span style={{ fontSize: "11px", background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", borderRadius: "999px", padding: "1px 7px" }}>You</span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: "#64748B" }}>{u.email}</td>
                  <td>
                    <span style={{
                      display: "inline-block", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 500,
                      background: u.role === "admin" ? "#F5F3FF" : "#EFF6FF",
                      color:      u.role === "admin" ? "#6D28D9"  : "#1D4ED8",
                      border:     `1px solid ${u.role === "admin" ? "#DDD6FE" : "#BFDBFE"}`,
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "#64748B", fontSize: "13px" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    {u._id !== currentUser?.id ? (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: "12px", padding: "5px 11px" }}
                        onClick={() => handleDelete(u._id, u.name)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#94A3B8" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
