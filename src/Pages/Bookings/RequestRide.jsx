import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMapMarkerAlt, FaLocationArrow, FaClock, FaCalendarAlt, FaCar, FaMotorcycle, FaShuttleVan } from "react-icons/fa";
import { MdOutlineMoped } from "react-icons/md";

const RequestRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [estimatedFare, setEstimatedFare] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    distanceKm: "", 
    type: "INSTANT",
    bookingTime: "",
    vehicleType: "SEDAN" // Default vehicle
  });

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setEstimatedFare(null); // Reset fare if they change locations/distance
  };

  const handleVehicleSelect = (type) => {
    setFormData({ ...formData, vehicleType: type });
    setEstimatedFare(null); // Reset fare if they change vehicle
  };

  // NEW: Call Ashini's Pricing API
  const calculateFare = async () => {
    if (!formData.distanceKm) {
      setError("Please enter an estimated distance to calculate fare.");
      return;
    }
    setCalculating(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:8080/api/pricing/estimate?distanceKm=${formData.distanceKm}&vehicleType=${formData.vehicleType}`);
      setEstimatedFare(response.data);
    } catch (err) {
      setError("Could not calculate fare. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estimatedFare) {
      setError("Please calculate the fare before confirming your ride.");
      return;
    }

    setLoading(true);
    setError("");

    // Updated payload mapping to the new BookingDto
    const payload = {
      customerId: user.id,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      distanceKm: parseFloat(formData.distanceKm),
      requestedVehicleType: formData.vehicleType,
      estimatedFare: estimatedFare,
      type: formData.type,
      bookingTime: formData.type === "SCHEDULED" ? formData.bookingTime : null
    };

    try {
      await axios.post("http://localhost:8080/api/bookings/request", payload);
      alert("Ride Requested Successfully!");
      navigate("/bookings"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/bookings" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm shrink-0">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Request a Ride</h1>
            <p className="text-gray-500 font-medium mt-1">Tell us where you want to go.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Locations & Distance */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="relative space-y-4">
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                  <FaLocationArrow className="text-gray-900" />
                </div>
                <input type="text" name="pickupLocation" placeholder="Pickup Location" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] outline-none font-bold" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ccff00] rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
                  <FaMapMarkerAlt className="text-gray-900" />
                </div>
                <input type="text" name="dropoffLocation" placeholder="Dropoff Location" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] outline-none font-bold" />
              </div>
            </div>

            <div className="mt-6 pl-16">
               <input type="number" name="distanceKm" step="0.1" placeholder="Estimated Distance (km) - e.g., 12.5" required onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] outline-none font-medium" />
            </div>
          </div>

          {/* Section 2: Vehicle Selection */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
             <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Vehicle Class</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               <div onClick={() => handleVehicleSelect("BIKE")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "BIKE" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 bg-white"}`}>
                 <FaMotorcycle size={28} className={formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-400"} />
                 <span className="text-xs font-bold">Bike</span>
               </div>
               <div onClick={() => handleVehicleSelect("THREE_WHEELER")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "THREE_WHEELER" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 bg-white"}`}>
                 <MdOutlineMoped size={32} className={formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-400"} />
                 <span className="text-xs font-bold">Tuk-Tuk</span>
               </div>
               <div onClick={() => handleVehicleSelect("SEDAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "SEDAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 bg-white"}`}>
                 <FaCar size={28} className={formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-400"} />
                 <span className="text-xs font-bold">Sedan</span>
               </div>
               <div onClick={() => handleVehicleSelect("VAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "VAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 bg-white"}`}>
                 <FaShuttleVan size={28} className={formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-400"} />
                 <span className="text-xs font-bold">Van</span>
               </div>
             </div>
          </div>

          {/* Section 3: Booking Type */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">When do you need the ride?</label>
            <div className="bg-gray-50 p-1 rounded-full flex border border-gray-200 mb-6">
              <button type="button" onClick={() => setFormData({ ...formData, type: "INSTANT" })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${formData.type === "INSTANT" ? "bg-gray-900 text-[#ccff00] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <FaClock /> Ride Now
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, type: "SCHEDULED" })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all ${formData.type === "SCHEDULED" ? "bg-gray-900 text-[#ccff00] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <FaCalendarAlt /> Schedule Later
              </button>
            </div>
            {formData.type === "SCHEDULED" && (
              <div>
                <input type="datetime-local" name="bookingTime" required onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] outline-none font-bold" />
              </div>
            )}
          </div>

          {/* Fare Calculation & Submission Area */}
          <div className="flex flex-col gap-4 mt-6">
            {!estimatedFare ? (
              <button type="button" onClick={calculateFare} disabled={calculating} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-sm text-lg">
                {calculating ? "Calculating..." : "Calculate Fare"}
              </button>
            ) : (
              <div className="bg-[#faffeb] border border-[#ccff00] p-6 rounded-2xl flex flex-col items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Estimated Total</span>
                <span className="text-4xl font-extrabold text-gray-900 mt-1">Rs. {estimatedFare.toFixed(2)}</span>
                
                <button type="submit" disabled={loading} className="w-full bg-[#ccff00] text-gray-900 font-extrabold py-4 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 shadow-sm text-lg mt-6">
                  {loading ? "Processing..." : "Confirm Ride"}
                </button>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default RequestRide;