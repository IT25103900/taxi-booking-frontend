import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaTags, FaCar, FaMotorcycle, FaShuttleVan, FaCalculator, FaBolt } from "react-icons/fa";
import { MdOutlineMoped } from "react-icons/md";

const FareEstimator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // Stores the response from Ashini's backend
  
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  const [formData, setFormData] = useState({
    distanceKm: "",
    vehicleType: "SEDAN" // Default selection
  });

  // Security: Only customers can check fares
  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleVehicleSelect = (type) => setFormData({ ...formData, vehicleType: type });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // Matches Ashini's FareEstimateDto.java perfectly!
    const payload = {
      customerId: user.id,
      distanceKm: parseFloat(formData.distanceKm),
      vehicleType: formData.vehicleType
    };

    try {
      // Hitting the Spring Boot Pricing Controller
      const response = await axios.post("http://localhost:8080/api/pricing/estimate", payload);
      setResult(response.data); // Save the result to display it
    } catch (err) {
      setError(err.response?.data || "Failed to calculate fare. Please try again.");
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
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Fare Estimator</h1>
              <p className="text-gray-500 font-medium mt-1">Calculate your trip cost before booking.</p>
            </div>
          </div>
        </div>
      <div className="max-w-4xl mx-auto">
        
    
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* LEFT SIDE: The Input Form */}
          <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <form onSubmit={handleCalculate} className="space-y-8">
              
              <div>
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">1. Estimated Distance (km)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="distanceKm" 
                  placeholder="e.g. 12.5" 
                  required 
                  onChange={handleChange} 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all text-gray-900 font-bold" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">2. Select Vehicle Class</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  
                  <div onClick={() => handleVehicleSelect("BIKE")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === "BIKE" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                    <FaMotorcycle size={24} className={formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-500"}`}>Bike</span>
                  </div>
                  
                  <div onClick={() => handleVehicleSelect("THREE_WHEELER")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === "THREE_WHEELER" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                    <MdOutlineMoped size={28} className={formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-500"}`}>Tuk-Tuk</span>
                  </div>
                  
                  <div onClick={() => handleVehicleSelect("SEDAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === "SEDAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                    <FaCar size={24} className={formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-500"}`}>Sedan</span>
                  </div>
                  
                  <div onClick={() => handleVehicleSelect("VAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === "VAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                    <FaShuttleVan size={24} className={formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-500"}`}>Van</span>
                  </div>
                  
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-[#ccff00] font-extrabold py-4 px-4 rounded-xl hover:bg-gray-800 transition duration-200 shadow-sm flex justify-center items-center gap-2 text-lg">
                {loading ? "Calculating..." : <><FaCalculator /> Get Fare Estimate</>}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: The Live Result Card */}
          <div className="md:col-span-2">
            {result ? (
              <div className="bg-[#ccff00] p-6 rounded-3xl shadow-sm border border-[#bbf000] h-full flex flex-col justify-center animate-fade-in relative overflow-hidden">
                
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="bg-gray-900 text-[#ccff00] p-3 rounded-xl w-max mb-6 shadow-sm">
                  <FaTags className="text-xl" />
                </div>
                
                <p className="text-gray-800 font-bold uppercase tracking-wider text-xs mb-1">Estimated Total</p>
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tighter">
                  Rs. {result.estimatedTotal.toFixed(2)}
                </h2>
                
                <div className="space-y-3 border-t border-gray-900/10 pt-6">
                  <div className="flex justify-between text-sm text-gray-800 font-medium">
                    <span>Distance:</span>
                    <span className="font-bold">{result.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-800 font-medium">
                    <span>Vehicle:</span>
                    <span className="font-bold">{result.vehicleType}</span>
                  </div>
                </div>

                {/* VIVA POINT: Surge Pricing Alert (Polymorphism in action!) */}
                {result.peakTime && (
                  <div className="mt-6 bg-gray-900 text-[#ccff00] p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider shadow-sm">
                    <FaBolt className="text-yellow-400 text-lg" /> Peak Hour Surge Applied (1.5x)
                  </div>
                )}
                
                <Link to="/bookings/request" className="mt-8 text-center block w-full bg-white text-gray-900 font-extrabold py-4 rounded-xl hover:bg-gray-50 transition shadow-sm border border-gray-100">
                  Book This Ride Now
                </Link>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col items-center justify-center text-center text-gray-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <FaCalculator className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="font-medium text-sm max-w-[200px]">Enter your distance and select a vehicle to see the live estimated fare.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FareEstimator;