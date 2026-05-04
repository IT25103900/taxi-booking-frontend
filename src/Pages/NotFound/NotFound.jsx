import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  // 1. SMART ROUTING CHECK
  // See if a user is logged in and what their role is
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));
  
  // Default to login, but change to the correct dashboard if they are logged in
  const targetPath = user 
    ? (user.role === "DRIVER" ? "/driver/dashboard" : "/customer/dashboard") 
    : "/login";

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 text-center font-sans relative overflow-hidden">
      
      {/* Decorative Brand Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ccff00] opacity-20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Icon Container */}
      <div className="relative z-10 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-3xl mb-4 animate-bounce">
        <FaExclamationTriangle className="text-gray-900 text-4xl" />
      </div>

      {/* Massive 404 Background Text */}
      <div className="absolute flex items-center justify-center z-0 pointer-events-none">
         <h1 className="text-[12rem] md:text-[18rem] font-extrabold text-gray-900 opacity-5 select-none tracking-tighter">404</h1>
      </div>
      
      {/* Text Content */}
      <div className="relative z-10 mt-2">
         <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Page Not Found</h2>
         <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium leading-relaxed px-4">
           Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
         </p>
         
         {/* 2. DYNAMIC LINK APPLIED HERE */}
         <Link to={targetPath}>
            <button className="bg-[#ccff00] hover:bg-[#bbf000] text-gray-900 font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm flex items-center gap-3 mx-auto">
                <FaHome size={18} /> Go Back Home
            </button>
         </Link>
      </div>

    </div>
  );
};

export default NotFound;