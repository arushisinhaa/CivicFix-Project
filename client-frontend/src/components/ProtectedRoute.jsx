import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log("ProtectedRoute - auth status:", {
    isAuthenticated,
    isAdmin,
    loading,
  }); // Add this

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login - not authenticated");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log("Redirecting to home - admin required");
    return <Navigate to="/" replace />;
  }

  return children;
}
