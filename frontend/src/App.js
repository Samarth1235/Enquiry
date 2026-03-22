import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar        from "./components/Navbar";
import LoginPage     from "./pages/LoginPage";
import Dashboard     from "./pages/Dashboard";
import AddEnquiry    from "./pages/AddEnquiry";
import EnquiryDetail from "./pages/EnquiryDetail";
import ManageUsers   from "./pages/ManageUsers";

export default function App() {
  const { user, loading } = useAuth();
  const [page,   setPage]   = useState("dashboard");
  const [viewId, setViewId] = useState(null);

  // Show loading spinner while restoring session
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
          <p style={{ color: "#64748B" }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in — show login
  if (!user) return <LoginPage />;

  // Staff trying to access admin-only page → redirect
  if (page === "users" && user.role !== "admin") {
    setPage("dashboard");
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Navbar page={page} setPage={setPage} />

      {page === "dashboard" && (
        <Dashboard
          setPage={setPage}
          setViewId={setViewId}
        />
      )}

      {page === "add" && (
        <AddEnquiry setPage={setPage} />
      )}

      {page === "detail" && viewId && (
        <EnquiryDetail
          enquiryId={viewId}
          setPage={setPage}
        />
      )}

      {page === "users" && user.role === "admin" && (
        <ManageUsers setPage={setPage} />
      )}
    </div>
  );
}
