import React from "react";
import { Navigate } from "react-router-dom";

// dùng cho admin page, nếu chưa login hoặc không phải admin thì sẽ bị redirect về home page
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role === "admin" && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
