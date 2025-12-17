import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const { token, isAdmin } = useSelector((state) => state.auth);

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
