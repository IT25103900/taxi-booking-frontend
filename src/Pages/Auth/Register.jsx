import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaCar } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "CUSTOMER",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:8080/api/users/register", userData);
      alert(
        userData.role === "CUSTOMER"
          ? "Passenger Account Created!"
          : "Driver Account Created!",
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2fceb] via-white to-white relative p-4 font-sans">
      {/* Top Right "Already have an account?" link (Matching the mockup) */}
      <div className="absolute top-6 right-8 text-sm font-medium text-gray-500 hidden sm:block">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-gray-900 font-bold hover:underline ml-1"
        >
          Log In
        </Link>
      </div>

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        {/* Logo Mockup */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#ccff00] rounded flex items-center justify-center text-black font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Dash Drive
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pill-shaped Role Toggle (Matching the mockup) */}
          <div className="bg-gray-50 p-1 rounded-full flex border border-gray-200 mb-6">
            <button
              type="button"
              onClick={() =>
                setUserData({
                  ...userData,
                  role: "CUSTOMER",
                  licenseNumber: "",
                })
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                userData.role === "CUSTOMER"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUser size={12} /> Passenger
            </button>
            <button
              type="button"
              onClick={() => setUserData({ ...userData, role: "DRIVER" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                userData.role === "DRIVER"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaCar size={14} /> Driver
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
            />

            {userData.role === "DRIVER" && (
              <div className="animate-fade-in-down">
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="Driving License Number"
                  required
                  onChange={handleChange}
                  className="w-full p-3.5 bg-[#faffeb] border border-[#ccff00] rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-500 text-gray-900 font-medium"
                />
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              required
              className="mt-1 border-gray-300 rounded text-[#ccff00] focus:ring-[#ccff00]"
            />
            <span className="text-xs text-gray-500 leading-tight">
              I agree with the{" "}
              <a href="#" className="text-gray-900 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-gray-900 underline">
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Signature Lime Green Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ccff00] text-gray-900 font-bold py-3.5 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 disabled:opacity-70 mt-6 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 sm:hidden">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
