import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedRole }) => {
  const user = JSON.parse(sessionStorage.getItem(allowedRole) || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role?.toLowerCase() !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
