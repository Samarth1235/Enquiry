import { useAuth } from "../context/AuthContext";

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px" }}>📋</span>
        <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "1rem" }}>EnquiryCRM</span>
        <span style={{ color: "#475569", fontSize: "11px" }}>
          {user?.role === "admin" ? "Admin Panel" : "Staff Panel"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          className="btn btn-ghost"
          style={{ color: "#94A3B8", border: "1px solid #334155", fontSize: "12px" }}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className="btn btn-ghost"
          style={{ color: "#94A3B8", border: "1px solid #334155", fontSize: "12px" }}
          onClick={() => setPage("add")}
        >
          + Add Enquiry
        </button>
        {user?.role === "admin" && (
          <button
            className="btn btn-ghost"
            style={{ color: "#94A3B8", border: "1px solid #334155", fontSize: "12px" }}
            onClick={() => setPage("users")}
          >
            Manage Users
          </button>
        )}

        <div style={{ marginLeft: "8px", display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid #1E293B", paddingLeft: "12px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
            {user?.name?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#F1F5F9", lineHeight: 1.2 }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#64748B", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ color: "#64748B", border: "1px solid #334155", fontSize: "12px", padding: "5px 10px", marginLeft: "4px" }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
