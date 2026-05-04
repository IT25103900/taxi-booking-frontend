import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // ADAPTATION: Checking localStorage for the user session from Sahan's backend
  // In a real app, you might use a React Context like useAuth() here.
  const user = JSON.parse(localStorage.getItem("dashdrive_user")); 

  // REAL LOGIC: If no user, redirect to login. Otherwise, render content.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;