import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCar,
  FaStar,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

const DriverDashboard = () => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = JSON.parse(localStorage.getItem("dashdrive_user"));
    if (sessionUser) {
      setUser(sessionUser);
      fetchDriverVehicles(sessionUser.id);
    }
  }, []);

  const fetchDriverVehicles = async (driverId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/vehicles/driver/${driverId}`,
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading)
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccff00]"></div>
      </div>
    );

  const hasVehicle = vehicles.length > 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Dark Mode Driver Banner */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-10 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
            Driver Portal
          </h1>
          <p className="text-gray-400 font-medium">
            Welcome back, {user.fullName}
          </p>
        </div>
        <div className="hidden md:block">
          <span className="bg-[#ccff00] text-gray-900 text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
            ID: {user.id}
          </span>
        </div>
      </div>

      {/* ALERT: Action Required */}
      {!hasVehicle && (
        <div className="bg-white border-2 border-orange-400 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex gap-5 items-center">
            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
              <FaExclamationTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Vehicle Registration Required
              </h3>
              <p className="text-gray-500 mt-1 font-medium">
                You must register a vehicle before accepting ride requests.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/vehicles/add")}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-[#ccff00] px-8 py-3.5 rounded-xl font-bold shadow transition shrink-0"
          >
            Register Vehicle
          </button>
        </div>
      )}

      {/* Driver Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
              Today's Earnings
            </h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <FaMoneyBillWave size={16} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Rs. 0
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
              Completed Trips
            </h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FaCar size={16} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
            0
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
              Average Rating
            </h3>
            <div className="p-2 bg-[#faffeb] text-[#ccff00] rounded-lg">
              <FaStar size={16} className="text-yellow-400" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
            --
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
