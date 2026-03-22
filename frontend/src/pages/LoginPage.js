import { useState } from "react";
import { loginUser } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email: email.trim(), password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.4rem", marginBottom: "10px" }}>📋</div>
          <h2 style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
            EnquiryCRM
          </h2>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
            Sign in to manage your enquiries
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "11px", marginTop: "6px", fontSize: "14px" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>

        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "12px", marginTop: "1.5rem" }}>
          Enquiry Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
