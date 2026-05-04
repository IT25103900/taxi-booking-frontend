import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaStar, FaRegStar, FaUserTie, FaCheckCircle } from "react-icons/fa";

const SubmitReview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  const [formData, setFormData] = useState({
    bookingId: "101", // Hardcoded for demo purposes (usually passed via URL params)
    rating: 0,
    comments: "",
    feedbackType: "DRIVER_REVIEW" // OOP Polymorphism trigger!
  });

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") navigate("/login");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Hitting Tharani's backend endpoint
      await axios.post("http://localhost:8080/api/reviews/submit", {
        ...formData,
        customerId: user.id
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-md w-full border border-gray-100">
          <FaCheckCircle className="text-[#ccff00] text-6xl mx-auto mb-6 bg-gray-900 rounded-full" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Review Submitted!</h2>
          <p className="text-gray-500 font-medium mb-8">Thank you for helping us keep Dash Drive safe and reliable.</p>
          <Link to="/bookings" className="block w-full bg-gray-900 text-[#ccff00] font-bold py-3.5 rounded-xl hover:bg-gray-800 transition">
            Back to My Rides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
      <div className="max-w-2xl mx-auto">
        
        {/* Standardized Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/bookings" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm shrink-0">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Rate Your Trip</h1>
            <p className="text-gray-500 font-medium mt-1">How was your experience with Dash Drive?</p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <FaUserTie className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Driver</h3>
            <p className="text-gray-500 text-sm">Trip #101</p>
          </div>

          <div className="mb-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                {star <= formData.rating ? (
                  <FaStar className="text-[#ccff00] text-4xl drop-shadow-sm bg-gray-900 rounded-lg p-1" />
                ) : (
                  <FaRegStar className="text-gray-300 text-4xl" />
                )}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Leave a Comment (Optional)</label>
            <textarea
              rows="4"
              placeholder="Was the car clean? Was the driver polite?"
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all text-gray-900 font-medium resize-none"
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#ccff00] text-gray-900 font-extrabold py-4 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 shadow-sm text-lg">
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default SubmitReview;