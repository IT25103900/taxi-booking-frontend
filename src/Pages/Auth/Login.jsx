import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/login?email=${email}&password=${password}`,
      );
      const userData = response.data;

      localStorage.setItem("dashdrive_user", JSON.stringify(userData));

      if (userData.role === "DRIVER") {
        navigate("/driver/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#ccff00] rounded flex items-center justify-center text-black font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Dash Drive
          </span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back to Dash Drive
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="border-gray-300 rounded text-[#ccff00] focus:ring-[#ccff00]"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm text-gray-900 font-semibold hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Signature Lime Green Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ccff00] text-gray-900 font-bold py-3.5 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 disabled:opacity-70 mt-6 shadow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-bold hover:underline ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
