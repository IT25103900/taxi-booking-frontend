import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// AllowedRole can be "DRIVER" or "CUSTOMER"
const RoleRoute = ({ allowedRole, children }) => {
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  // If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role doesn't match the allowed role, kick them back to their own dashboard
  if (user.role !== allowedRole) {
    const redirectPath = user.role === "DRIVER" ? "/driver/dashboard" : "/customer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;