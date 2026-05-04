import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaHistory, FaTags } from "react-icons/fa";

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = JSON.parse(localStorage.getItem("dashdrive_user"));
    if (sessionUser) setUser(sessionUser);
  }, []);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Signature Welcome Banner */}
      <div className="bg-[#faffeb] border border-[#ccff00] rounded-3xl p-8 md:p-10 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Ready for a ride, {user.fullName.split(" ")[0]}?
          </h1>
          <p className="text-gray-600 font-medium">
            Select a service below to get moving.
          </p>
        </div>
        {/* Decorative Element */}
        <div className="absolute -right-5 -top-10 w-64 h-64 bg-[#ccff00] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/bookings/request"
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-[#ccff00] transition-all group cursor-pointer flex flex-col items-start"
        >
          <div className="w-14 h-14 bg-gray-900 text-[#ccff00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-md">
            <FaMapMarkerAlt size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Request a Ride
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Book an instant or scheduled ride with our premium fleet.
          </p>
        </Link>

        <Link
          to="/pricing"
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-[#ccff00] transition-all group cursor-pointer flex flex-col items-start"
        >
          <div className="w-14 h-14 bg-[#ccff00] text-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
            <FaTags size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Fare Estimator
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Check peak hours and calculate your estimated trip cost.
          </p>
        </Link>

        <Link
          to="/bookings"
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-gray-300 transition-all group cursor-pointer flex flex-col items-start"
        >
          <div className="w-14 h-14 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <FaHistory size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ride History</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            View your past trips, ratings, and download invoices.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
