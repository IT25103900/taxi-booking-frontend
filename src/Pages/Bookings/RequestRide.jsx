import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMapMarkerAlt, FaLocationArrow, FaClock, FaCalendarAlt, FaCar, FaMotorcycle, FaShuttleVan } from "react-icons/fa";
import { MdOutlineMoped } from "react-icons/md";

const RequestRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  // The Form Data matching Member 03's BookingDto.java
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    distanceKm: "", // We'll manually enter this since we don't have Google Maps API yet
    vehicleType: "SEDAN",
    bookingType: "STANDARD", // "STANDARD" or "SCHEDULED"
    scheduledTime: ""
  });

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleSelect = (type) => {
    setFormData({ ...formData, vehicleType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Preparing the payload exactly as the Spring Boot DTO expects
    const payload = {
      customerId: user.id,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      distanceKm: parseFloat(formData.distanceKm) || 5.0, // Default to 5km if left blank
      requestedVehicleType: formData.vehicleType,
      bookingType: formData.bookingType,
      // Only attach time if it's a scheduled ride (Inheritance logic)
      scheduledTime: formData.bookingType === "SCHEDULED" ? formData.scheduledTime : null
    };

    try {
      await axios.post("http://localhost:8080/api/bookings/request", payload);
      alert("Ride Requested Successfully!");
      navigate("/bookings"); // Send to ride history
    } catch (err) {
      setError(err.response?.data || "Failed to request ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
       {/* --- Standardized Page Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/customer/dashboard" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm shrink-0">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Request a Ride</h1>
              <p className="text-gray-500 font-medium mt-1">Tell us where you want to go.</p>
            </div>
          </div>
        </div>
        {/* -------------------------------- */}
      <div className="max-w-3xl mx-auto">
      
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Locations */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="relative space-y-4">
              {/* Decorative line connecting the dots */}
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                  <FaLocationArrow className="text-gray-900" />
                </div>
                <input type="text" name="pickupLocation" placeholder="Pickup Location (e.g., Colombo 03)" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-bold" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ccff00] rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
                  <FaMapMarkerAlt className="text-gray-900" />
                </div>
                <input type="text" name="dropoffLocation" placeholder="Dropoff Location (e.g., Kandy)" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-bold" />
              </div>
            </div>

            <div className="mt-6 pl-16">
               <input type="number" name="distanceKm" step="0.1" placeholder="Estimated Distance (km) - e.g., 12.5" required onChange={handleChange} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" />
            </div>
          </div>

          {/* Section 2: When do you need it? (Triggers OOP Inheritance) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">When do you need the ride?</label>
            
            <div className="bg-gray-50 p-1 rounded-full flex border border-gray-200 mb-6">
              <button type="button" onClick={() => setFormData({ ...formData, bookingType: "STANDARD" })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${formData.bookingType === "STANDARD" ? "bg-gray-900 text-[#ccff00] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <FaClock /> Ride Now
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, bookingType: "SCHEDULED" })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${formData.bookingType === "SCHEDULED" ? "bg-gray-900 text-[#ccff00] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <FaCalendarAlt /> Schedule Later
              </button>
            </div>

            {formData.bookingType === "SCHEDULED" && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date & Time</label>
                <input type="datetime-local" name="scheduledTime" required onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all text-gray-900 font-bold" />
              </div>
            )}
          </div>

          {/* Section 3: Select Vehicle */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
             <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Vehicle Class</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               
               <div onClick={() => handleVehicleSelect("BIKE")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "BIKE" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                 <FaMotorcycle size={28} className={formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-400"} />
                 <span className={`text-xs font-bold ${formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-500"}`}>Bike</span>
               </div>

               <div onClick={() => handleVehicleSelect("THREE_WHEELER")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "THREE_WHEELER" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                 <MdOutlineMoped size={32} className={formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-400"} />
                 <span className={`text-xs font-bold ${formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-500"}`}>Tuk-Tuk</span>
               </div>

               <div onClick={() => handleVehicleSelect("SEDAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "SEDAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                 <FaCar size={28} className={formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-400"} />
                 <span className={`text-xs font-bold ${formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-500"}`}>Sedan</span>
               </div>

               <div onClick={() => handleVehicleSelect("VAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "VAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                 <FaShuttleVan size={28} className={formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-400"} />
                 <span className={`text-xs font-bold ${formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-500"}`}>Van</span>
               </div>

             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#ccff00] text-gray-900 font-extrabold py-4 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 shadow-sm text-lg mt-4">
            {loading ? "Confirming..." : "Confirm Ride Request"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default RequestRide;