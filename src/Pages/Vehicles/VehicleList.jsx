import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCar, FaMotorcycle, FaShuttleVan, FaPlus, FaIdCard, FaInfoCircle } from "react-icons/fa";
import { MdOutlineMoped } from "react-icons/md";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licenseInfo, setLicenseInfo] = useState({}); // Stores the polymorphic license strings
  const [fetchingLicense, setFetchingLicense] = useState(null); // Tracks which button is loading

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  useEffect(() => {
    if (!user || user.role !== "DRIVER") {
      navigate("/login");
      return;
    }
    fetchVehicles();
  }, [user, navigate]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/vehicles/driver/${user.id}`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching fleet:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---> VIVA POINT: Triggering the Polymorphic Backend Method <---
  const checkRequiredLicense = async (vehicleId) => {
    setFetchingLicense(vehicleId);
    try {
      const response = await axios.get(`http://localhost:8080/api/vehicles/${vehicleId}/required-license`);
      
      // Update the state to show this specific vehicle's requirement
      setLicenseInfo(prev => ({ ...prev, [vehicleId]: response.data }));
    } catch (error) {
      console.error("Error fetching license requirement", error);
    } finally {
      setFetchingLicense(null);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "BIKE": return <FaMotorcycle size={28} />;
      case "THREE_WHEELER": return <MdOutlineMoped size={32} />;
      case "VAN": return <FaShuttleVan size={28} />;
      default: return <FaCar size={28} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fafafa] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccff00]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Fleet</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your registered vehicles and compliance.</p>
          </div>
          <Link to="/vehicles/add">
            <button className="bg-[#ccff00] hover:bg-[#bbf000] text-gray-900 font-bold py-3 px-6 rounded-xl shadow-sm transition flex items-center gap-2">
              <FaPlus /> Register New Vehicle
            </button>
          </Link>
        </div>

        {/* Empty State */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCar className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't registered any vehicles yet. You need at least one active vehicle to start accepting rides.</p>
            <Link to="/vehicles/add" className="text-[#ccff00] bg-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition inline-block">
              Add Your First Vehicle
            </Link>
          </div>
        ) : (
          /* Vehicle Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-[#ccff00] transition-all group flex flex-col">
                
                {/* Top Row: Status & Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 group-hover:bg-[#faffeb] text-gray-900 rounded-2xl flex items-center justify-center transition-colors">
                    {getVehicleIcon(vehicle.vehicleType || vehicle.dtype?.toUpperCase() || "SEDAN")}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    vehicle.status === "AVAILABLE" ? "bg-green-100 text-green-700" : 
                    vehicle.status === "MAINTENANCE" ? "bg-orange-100 text-orange-700" : 
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mb-6 flex-1">
                  <h3 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-1">
                    {vehicle.licensePlate}
                  </h3>
                  <p className="text-gray-500 font-medium">
                    {vehicle.brand} {vehicle.model}
                  </p>
                </div>

                {/* Polymorphism Showcase Block */}
                <div className="bg-gray-50 rounded-2xl p-4 mt-auto border border-gray-100">
                  {licenseInfo[vehicle.id] ? (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-1">
                        <FaInfoCircle className="text-blue-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Legal Requirement</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {licenseInfo[vehicle.id]}
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => checkRequiredLicense(vehicle.id)}
                      disabled={fetchingLicense === vehicle.id}
                      className="w-full bg-white border border-gray-200 hover:border-gray-900 text-gray-900 text-sm font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {fetchingLicense === vehicle.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      ) : (
                        <><FaIdCard /> Check License Req.</>
                      )}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleList;