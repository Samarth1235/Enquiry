import { useState, useEffect, useCallback } from "react";
import { getEnquiries, getStats, deleteEnquiry } from "../api";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = ["New Lead", "Follow Up", "Interested", "Passed", "Rejected"];

function badgeClass(status) {
  const map = {
    "New Lead":   "badge-new-lead",
    "Follow Up":  "badge-follow-up",
    "Interested": "badge-interested",
    "Passed":     "badge-passed",
    "Rejected":   "badge-rejected",
  };
  return "badge " + (map[status] || "");
}

export default function Dashboard({ setPage, setViewId }) {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [stats,     setStats]     = useState({});
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [search,    setSearch]    = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteMsg, setDeleteMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)                    params.search = search;
      if (filterStatus !== "All")    params.status = filterStatus;
      const [enqRes, statsRes] = await Promise.all([getEnquiries(params), getStats()]);
      setEnquiries(enqRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete enquiry for ${name}?`)) return;
    try {
      await deleteEnquiry(id);
      setDeleteMsg(`Enquiry for ${name} deleted.`);
      setTimeout(() => setDeleteMsg(""), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  }

  const statCards = [
    { label: "Total Enquiries", value: stats.total    || 0, color: "#2563EB" },
    { label: "New Leads",       value: stats.newLead  || 0, color: "#7C3AED" },
    { label: "Follow Up",       value: stats.followUp || 0, color: "#D97706" },
    { label: "Interested",      value: stats.interested || 0, color: "#16A34A" },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setPage("add")}>+ New Enquiry</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {statCards.map(s => (
          <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {error     && <div className="alert alert-error">{error}</div>}
      {deleteMsg && <div className="alert alert-success">✅ {deleteMsg}</div>}

      {/* Filters */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ maxWidth: "260px" }}
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ maxWidth: "170px" }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <span style={{ fontSize: "13px", color: "#64748B" }}>{enquiries.length} result(s)</span>
          <button className="btn btn-ghost" style={{ marginLeft: "auto", fontSize: "12px" }} onClick={fetchData}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner"></div></div>
          ) : (
            <table>
              <thead>
                <tr>
                  {["Enquiry ID", "Client", "Phone", "Service", "Status", "Follow-ups", "Date", "Actions"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "#94A3B8", padding: "3rem" }}>
                      No enquiries found.
                    </td>
                  </tr>
                ) : enquiries.map(enq => (
                  <tr key={enq._id}>
                    <td><span className="chip">{enq.enquiryId}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{enq.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{enq.email}</div>
                    </td>
                    <td>{enq.phone}</td>
                    <td>{enq.service}</td>
                    <td><span className={badgeClass(enq.status)}>{enq.status}</span></td>
                    <td style={{ color: "#64748B" }}>{enq.followUps?.length || 0} note(s)</td>
                    <td style={{ color: "#64748B", fontSize: "12px" }}>
                      {new Date(enq.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: "12px", padding: "5px 11px" }}
                          onClick={() => { setViewId(enq._id); setPage("detail"); }}
                        >
                          View
                        </button>
                        {user?.role === "admin" && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: "12px", padding: "5px 11px" }}
                            onClick={() => handleDelete(enq._id, enq.name)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
