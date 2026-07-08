// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;
  if (!session) return <Navigate to="/signin" replace />;
  if (profile?.status === "banned") return <Navigate to="/banned" replace />;
  if (allowedRoles && !allowedRoles.includes(profile?.role)) return <Navigate to="/" replace />;

  return children;
}