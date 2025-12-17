import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedUser({ children }) {
  const { token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
