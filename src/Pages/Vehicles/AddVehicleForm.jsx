import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaCar, FaMotorcycle, FaShuttleVan, FaArrowLeft, FaCheck } from "react-icons/fa";
import { MdOutlineMoped } from "react-icons/md"; // For Tuk-Tuk

const AddVehicleForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 1. Fetch the logged-in driver's ID automatically
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  // 2. The Form Data matches Janith's VehicleDto.java exactly!
  const [formData, setFormData] = useState({
    driverId: user?.id || null,
    licensePlate: "",
    brand: "",
    model: "",
    vehicleType: "SEDAN", // Default selection
    
    // Child-class specific properties
    passengerCapacity: 4, 
    providesPassengerHelmet: false,
    hasLuggageCarrier: false
  });

  // Security check: Redirect if not a driver
  useEffect(() => {
    if (!user || user.role !== "DRIVER") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleVehicleTypeSelect = (type) => {
    setFormData({ ...formData, vehicleType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // HITTING JANITH'S API ENDPOINT
      await axios.post("http://localhost:8080/api/vehicles/add", formData);
      navigate("/driver/dashboard"); // Send them back to their newly unlocked dashboard!
    } catch (err) {
      setError(err.response?.data || "Failed to register vehicle. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
       {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/driver/dashboard" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register Vehicle</h1>
            <p className="text-gray-500 font-medium mt-1">Add a new vehicle to your Dash Drive fleet.</p>
          </div>
        </div>
      <div className="max-w-3xl mx-auto">
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-3 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {/* STEP 1: Select Vehicle Type (Beautiful Visual Toggle) */}
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">1. Select Vehicle Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              
              {/* Type: BIKE */}
              <div onClick={() => handleVehicleTypeSelect("BIKE")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "BIKE" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                <FaMotorcycle size={28} className={formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-400"} />
                <span className={`text-xs font-bold ${formData.vehicleType === "BIKE" ? "text-gray-900" : "text-gray-500"}`}>Bike</span>
              </div>

              {/* Type: THREE_WHEELER */}
              <div onClick={() => handleVehicleTypeSelect("THREE_WHEELER")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "THREE_WHEELER" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                <MdOutlineMoped size={28} className={formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-400"} />
                <span className={`text-xs font-bold ${formData.vehicleType === "THREE_WHEELER" ? "text-gray-900" : "text-gray-500"}`}>Tuk-Tuk</span>
              </div>

              {/* Type: MINI_CAR */}
              <div onClick={() => handleVehicleTypeSelect("MINI_CAR")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "MINI_CAR" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                <FaCar size={24} className={formData.vehicleType === "MINI_CAR" ? "text-gray-900" : "text-gray-400"} />
                <span className={`text-xs font-bold ${formData.vehicleType === "MINI_CAR" ? "text-gray-900" : "text-gray-500"}`}>Mini</span>
              </div>

              {/* Type: SEDAN */}
              <div onClick={() => handleVehicleTypeSelect("SEDAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "SEDAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                <FaCar size={28} className={formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-400"} />
                <span className={`text-xs font-bold ${formData.vehicleType === "SEDAN" ? "text-gray-900" : "text-gray-500"}`}>Sedan</span>
              </div>

              {/* Type: VAN */}
              <div onClick={() => handleVehicleTypeSelect("VAN")} className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.vehicleType === "VAN" ? "border-[#ccff00] bg-[#faffeb]" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                <FaShuttleVan size={28} className={formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-400"} />
                <span className={`text-xs font-bold ${formData.vehicleType === "VAN" ? "text-gray-900" : "text-gray-500"}`}>Van</span>
              </div>

            </div>
          </div>

          {/* STEP 2: General Details */}
          <div>
             <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">2. Vehicle Details</label>
             <div className="space-y-4">
                <input 
                  type="text" 
                  name="licensePlate" 
                  placeholder="License Plate (e.g., CBA-1234)" 
                  required 
                  onChange={handleChange} 
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-bold uppercase" 
                />
                
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    name="brand" 
                    placeholder="Brand (e.g., Toyota)" 
                    required 
                    onChange={handleChange} 
                    className="w-1/2 p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" 
                  />
                  <input 
                    type="text" 
                    name="model" 
                    placeholder="Model (e.g., Prius)" 
                    required 
                    onChange={handleChange} 
                    className="w-1/2 p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" 
                  />
                </div>
             </div>
          </div>

          {/* STEP 3: DYNAMIC OOP INHERITANCE FIELDS */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
             <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Specific Features</label>
             <p className="text-xs text-gray-500 mb-4">These options change based on your selected vehicle type.</p>
             
             {formData.vehicleType === "VAN" && (
                <div className="animate-fade-in-down">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Passenger Capacity</label>
                  <input type="number" name="passengerCapacity" min="5" max="15" value={formData.passengerCapacity} onChange={handleChange} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
             )}

             {formData.vehicleType === "BIKE" && (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-gray-200 rounded-xl hover:border-[#ccff00] transition animate-fade-in-down">
                  <div className="relative flex items-center">
                    <input type="checkbox" name="providesPassengerHelmet" onChange={handleChange} className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:ring-0 checked:bg-[#ccff00] checked:border-[#ccff00] cursor-pointer transition-all" />
                    <FaCheck className="absolute left-1 text-gray-900 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={12} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">I provide a safety helmet for the passenger.</span>
                </label>
             )}

             {formData.vehicleType === "THREE_WHEELER" && (
                 <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-gray-200 rounded-xl hover:border-[#ccff00] transition animate-fade-in-down">
                  <div className="relative flex items-center">
                    <input type="checkbox" name="hasLuggageCarrier" onChange={handleChange} className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:ring-0 checked:bg-[#ccff00] checked:border-[#ccff00] cursor-pointer transition-all" />
                    <FaCheck className="absolute left-1 text-gray-900 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={12} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">My Tuk-Tuk has a rear luggage carrier.</span>
                </label>
             )}

             {(formData.vehicleType === "SEDAN" || formData.vehicleType === "MINI_CAR") && (
                <div className="text-sm text-gray-500 font-medium italic animate-fade-in-down">
                  No additional configuration required for standard cars.
                </div>
             )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#ccff00] text-gray-900 font-extrabold py-4 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 disabled:opacity-70 shadow-sm mt-8 text-lg flex justify-center items-center gap-2">
            {loading ? "Registering..." : (
              <>
                <FaCheck /> Add Vehicle to Fleet
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddVehicleForm;