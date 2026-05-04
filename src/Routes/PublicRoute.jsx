import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Check if the user is already logged in
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  // REAL LOGIC: If user is ALREADY logged in, send them to their specific Dashboard!
  if (user) {
    const targetPath = user.role === "DRIVER" ? "/driver/dashboard" : "/customer/dashboard";
    return <Navigate to={targetPath} replace />;
  }

  // If not logged in, allow them to view the Login/Register page
  return children ? children : <Outlet />;
};

export default PublicRoute;