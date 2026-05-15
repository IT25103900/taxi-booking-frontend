import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaLocationArrow, FaClock, FaCalendarAlt, FaTimesCircle, FaPlus, FaCheckCircle, FaCarSide } from "react-icons/fa";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/history/${user.id}`);
      const sortedBookings = response.data.sort((a, b) => b.id - a.id);
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;
    
    setCancellingId(booking.id);
    try {
      const isFutureRide = new Date(booking.bookingTime) > new Date();

      if (booking.status === "PENDING" && isFutureRide) {
        await axios.delete(`http://localhost:8080/api/bookings/${booking.id}/cancel-scheduled`);
        alert("Scheduled booking completely removed from the system.");
      } else {
        await axios.put(`http://localhost:8080/api/bookings/${booking.id}/status?status=CANCELLED`);
        alert("Ride status updated to Cancelled.");
      }
      
      fetchBookings();
    } catch (error) {
      alert(error.response?.data || "Failed to cancel the booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><FaClock /> Pending</span>;
      case "ACCEPTED": return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><FaCarSide /> Accepted</span>;
      case "COMPLETED": return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><FaCheckCircle /> Completed</span>;
      case "CANCELLED": return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><FaTimesCircle /> Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fafafa] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccff00]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Rides</h1>
              <p className="text-gray-500 font-medium mt-1">View your past trips and active requests.</p>
            </div>
          </div>
          
          <Link to="/bookings/request">
            <button className="bg-[#ccff00] hover:bg-[#bbf000] text-gray-900 font-bold py-3 px-6 rounded-xl shadow-sm transition flex items-center gap-2">
              <FaPlus /> Request a Ride
            </button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rides Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't requested any rides on Dash Drive yet. Ready to get moving?</p>
            <Link to="/bookings/request" className="text-[#ccff00] bg-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition inline-block">
              Book Your First Ride
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row gap-6 hover:border-[#ccff00] transition-colors group">
                
                {/* Left Side: Locations */}
                <div className="flex-1 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100"></div>
                  
                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border-4 border-white">
                      <FaLocationArrow className="text-gray-500" />
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup</p>
                      <h4 className="text-lg font-bold text-gray-900 leading-tight">{booking.pickupLocation}</h4>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 bg-[#faffeb] text-[#ccff00] rounded-full flex items-center justify-center shrink-0 border-4 border-white">
                      <FaMapMarkerAlt className="text-gray-900" />
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dropoff</p>
                      <h4 className="text-lg font-bold text-gray-900 leading-tight">{booking.dropoffLocation}</h4>
                    </div>
                  </div>
                </div>

                {/* Right Side: Details & Actions */}
                <div className="md:w-72 flex flex-col justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {getStatusBadge(booking.status)}
                      
                      {/* --- NEW: Price & Distance Display --- */}
                      <div className="text-right">
                        <span className="block text-xl font-extrabold text-gray-900">
                          Rs. {booking.estimatedFare ? booking.estimatedFare.toFixed(2) : "0.00"}
                        </span>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                          {booking.distanceKm ? `${booking.distanceKm} km` : 'N/A'}
                        </span>
                      </div>
                      {/* ------------------------------------ */}
                      
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaCarSide className="text-gray-400" /> 
                        <span className="font-semibold text-gray-900">{booking.requestedVehicleType || "Standard"}</span> Class
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        {new Date(booking.bookingTime) > new Date() ? (
                          <><FaCalendarAlt className="text-gray-400 mt-1" /> <span className="font-semibold text-gray-900">Scheduled for:<br/>{new Date(booking.bookingTime).toLocaleString()}</span></>
                        ) : (
                          <><FaClock className="text-gray-400 mt-1" /> <span className="font-semibold text-gray-900">Requested at:<br/>{new Date(booking.bookingTime).toLocaleString()}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                    <button 
                      onClick={() => handleCancelBooking(booking)}
                      disabled={cancellingId === booking.id}
                      className="w-full mt-auto bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {cancellingId === booking.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        "Cancel Ride"
                      )}
                    </button>
                  )}

                  {(booking.status === "COMPLETED" || booking.status === "CANCELLED") && (
                     <div className="mt-auto text-center text-xs font-bold text-gray-400 uppercase tracking-widest pt-2 border-t border-gray-200">
                       Trip Closed
                     </div>
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

export default BookingHistory;