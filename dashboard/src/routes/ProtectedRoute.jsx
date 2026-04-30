import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  // If a specific role is required, enforce it
  if (allowedRole && role !== allowedRole) {
    // Redirect to the correct dashboard
    if (role === "admin") return <Navigate to="/" replace />;
    if (role === "intern") return <Navigate to="/intern" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
