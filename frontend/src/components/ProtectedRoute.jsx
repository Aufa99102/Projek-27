import React from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../utils/api";

function ProtectedRoute({ children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
