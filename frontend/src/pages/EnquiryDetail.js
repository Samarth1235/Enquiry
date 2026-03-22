import { useState, useEffect, useCallback } from "react";
import { getEnquiry, updateStatus, addFollowUp } from "../api";
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

export default function EnquiryDetail({ enquiryId, setPage }) {
  const { user } = useAuth();
  const [enq,      setEnq]      = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [flash,    setFlash]    = useState("");
  const [status,   setStatus]   = useState("");
  const [note,     setNote]     = useState("");
  const [noteErr,  setNoteErr]  = useState("");
  const [saving,   setSaving]   = useState(false);

  const fetchEnquiry = useCallback(async () => {
    try {
      const res = await getEnquiry(enquiryId);
      setEnq(res.data.data);
      setStatus(res.data.data.status);
    } catch (err) {
      setError("Failed to load enquiry details.");
    } finally {
      setLoading(false);
    }
  }, [enquiryId]);

  useEffect(() => { fetchEnquiry(); }, [fetchEnquiry]);

  function showFlash(msg) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2500);
  }

  async function handleStatusSave() {
    setSaving(true);
    try {
      const res = await updateStatus(enquiryId, status);
      setEnq(res.data.data);
      showFlash("Status updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddFollowUp() {
    if (!note.trim()) { setNoteErr("Please enter a follow-up note."); return; }
    setSaving(true);
    try {
      const res = await addFollowUp(enquiryId, note.trim());
      setEnq(res.data.data);
      setNote("");
      setNoteErr("");
      showFlash("Follow-up note added!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add follow-up.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (error)   return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!enq)    return null;

  const InfoRow = ({ label, value }) => (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "14px", color: "#0F172A" }}>{value}</div>
    </div>
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: "8px" }}>{enq.name}</h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="chip">{enq.enquiryId}</span>
            <span className={badgeClass(enq.status)}>{enq.status}</span>
            <span style={{ fontSize: "12px", color: "#94A3B8" }}>
              Added on {new Date(enq.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            {enq.createdByName && (
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>by {enq.createdByName}</span>
            )}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => setPage("dashboard")}>← Dashboard</button>
      </div>

      {flash && <div className="alert alert-success">✅ {flash}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "1.5rem" }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Client Info */}
          <div className="card">
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
              Client Information
            </div>
            <InfoRow label="Full Name" value={enq.name} />
            <InfoRow label="Phone"     value={enq.phone} />
            <InfoRow label="Email"     value={enq.email} />
            <InfoRow label="Service"   value={enq.service} />
            <InfoRow label="Message"   value={enq.message} />
          </div>

          {/* Update Status */}
          <div className="card">
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
              Update Status
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ marginBottom: "0.75rem" }}
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={handleStatusSave} disabled={saving}>
              {saving ? "Saving…" : "Save Status"}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Add Follow-Up */}
          <div className="card">
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
              Add Follow-Up Note
            </div>
            <textarea
              className={noteErr ? "error" : ""}
              placeholder="e.g. Called client, confirmed interest in the plan…"
              value={note}
              onChange={e => { setNote(e.target.value); setNoteErr(""); }}
            />
            {noteErr && <div className="error-msg">{noteErr}</div>}
            <button
              className="btn btn-success"
              style={{ marginTop: "0.5rem" }}
              onClick={handleAddFollowUp}
              disabled={saving}
            >
              {saving ? "Adding…" : "+ Add Note"}
            </button>
          </div>

          {/* Follow-Up Timeline */}
          <div className="card">
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
              Follow-Up History ({enq.followUps?.length || 0})
            </div>
            {!enq.followUps?.length ? (
              <p style={{ color: "#94A3B8", fontSize: "14px" }}>No follow-ups recorded yet.</p>
            ) : (
              [...enq.followUps].reverse().map((fu, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
                    {new Date(fu.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    {fu.addedByName && (
                      <span style={{ color: "#94A3B8", fontWeight: 400, marginLeft: "6px", textTransform: "none" }}>
                        by {fu.addedByName}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "14px", color: "#334155" }}>{fu.note}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
