import { useState } from "react";
import { createEnquiry } from "../api";

const SERVICE_OPTIONS = ["Coaching", "Consulting", "Software Dev", "Marketing", "Design", "Other"];

export default function AddEnquiry({ setPage }) {
  const [form, setForm]       = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  function set(key) { return e => setForm(f => ({ ...f, [key]: e.target.value })); }

  function validate() {
    const e = {};
    if (!form.name.trim())                e.name    = "Name is required";
    if (!/^\d{10}$/.test(form.phone))     e.phone   = "Enter a valid 10-digit phone number";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = "Enter a valid email address";
    if (!form.service)                     e.service = "Please select a service";
    if (!form.message.trim())              e.message = "Message is required";
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      await createEnquiry(form);
      setSuccess("Enquiry added successfully! It appears in the dashboard with status New Lead.");
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
      setErrors({});
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create enquiry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Add New Enquiry</h1>
        <button className="btn btn-ghost" onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
      </div>

      {success  && <div className="alert alert-success">✅ {success}</div>}
      {apiError && <div className="alert alert-error">{apiError}</div>}

      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label>Client Name</label>
            <input value={form.name} onChange={set("name")} placeholder="e.g. Ravi Kumar" className={errors.name ? "error" : ""} />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={set("phone")} placeholder="10-digit mobile number" className={errors.phone ? "error" : ""} />
            {errors.phone && <div className="error-msg">{errors.phone}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="client@example.com" className={errors.email ? "error" : ""} />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Service Interested In</label>
            <select value={form.service} onChange={set("service")} className={errors.service ? "error" : ""}>
              <option value="">Select a service…</option>
              {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.service && <div className="error-msg">{errors.service}</div>}
          </div>
        </div>
        <div className="form-group">
          <label>Initial Message / Notes</label>
          <textarea
            value={form.message}
            onChange={set("message")}
            placeholder="Describe the client's requirement…"
            className={errors.message ? "error" : ""}
          />
          {errors.message && <div className="error-msg">{errors.message}</div>}
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit Enquiry"}
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("dashboard")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
