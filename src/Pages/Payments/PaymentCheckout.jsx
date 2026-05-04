import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMoneyBillWave, FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("dashdrive_user"));

  // OOP Polymorphism Trigger: paymentMethod determines the backend object created!
  const [paymentMethod, setPaymentMethod] = useState("CASH"); 
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  // Dummy fare for checkout
  const fareAmount = 1450.00;

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") navigate("/login");
  }, [user, navigate]);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      customerId: user.id,
      amount: fareAmount,
      paymentType: paymentMethod, // "CASH" or "CARD"
      // Only send card details if paying by card
      cardNumber: paymentMethod === "CARD" ? cardDetails.number : null
    };

    try {
      await axios.post("http://localhost:8080/api/payments/process", payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || "Payment failed to process.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-md w-full border border-gray-100">
          <FaCheckCircle className="text-[#ccff00] text-6xl mx-auto mb-6 bg-gray-900 rounded-full" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 font-medium mb-8">Your transaction has been securely processed.</p>
          <Link to="/customer/dashboard" className="block w-full bg-gray-900 text-[#ccff00] font-bold py-3.5 rounded-xl hover:bg-gray-800 transition">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Standardized Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/bookings" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm shrink-0">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
            <p className="text-gray-500 font-medium mt-1">Select your preferred payment method.</p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: Payment Selection (Polymorphism) */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-lg font-extrabold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "CASH" ? "border-gray-900 bg-gray-50" : "border-gray-100 hover:border-gray-300"}`}>
                <input type="radio" name="payment" checked={paymentMethod === "CASH"} onChange={() => setPaymentMethod("CASH")} className="hidden" />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${paymentMethod === "CASH" ? "bg-[#ccff00] text-gray-900" : "bg-gray-100 text-gray-400"}`}>
                  <FaMoneyBillWave size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cash to Driver</h4>
                  <p className="text-xs text-gray-500 font-medium">Pay directly at the end of the trip</p>
                </div>
              </label>

              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "CARD" ? "border-gray-900 bg-gray-50" : "border-gray-100 hover:border-gray-300"}`}>
                <input type="radio" name="payment" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} className="hidden" />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${paymentMethod === "CARD" ? "bg-[#ccff00] text-gray-900" : "bg-gray-100 text-gray-400"}`}>
                  <FaCreditCard size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Credit / Debit Card</h4>
                  <p className="text-xs text-gray-500 font-medium">Secure online payment</p>
                </div>
              </label>
            </div>

            {/* Dynamic Card Inputs */}
            {paymentMethod === "CARD" && (
              <div className="animate-fade-in-down space-y-4">
                <input type="text" placeholder="Card Number" maxLength="16" onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all font-bold" />
                <div className="flex gap-4">
                  <input type="text" placeholder="MM/YY" maxLength="5" onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-1/2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all font-bold" />
                  <input type="password" placeholder="CVV" maxLength="3" onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} className="w-1/2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ccff00] focus:border-gray-900 focus:outline-none transition-all font-bold" />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2"><FaLock /> Secured by Stripe Integration</p>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ccff00] opacity-10 rounded-full blur-2xl pointer-events-none"></div>
              
              <h2 className="text-lg font-bold text-gray-400 mb-6 uppercase tracking-wider text-xs">Trip Summary</h2>
              
              <div className="space-y-4 mb-6 border-b border-gray-700 pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Trip Fare</span>
                  <span className="font-bold">Rs. 1,400.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Taxes & Fees</span>
                  <span className="font-bold">Rs. 50.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-xl font-bold">Total</span>
                <span className="text-4xl font-extrabold text-[#ccff00]">Rs. {fareAmount.toFixed(2)}</span>
              </div>

              <button onClick={handleProcessPayment} disabled={loading} className="w-full bg-[#ccff00] text-gray-900 font-extrabold py-4 px-4 rounded-xl hover:bg-[#bbf000] transition duration-200 shadow-sm text-lg">
                {loading ? "Processing..." : `Confirm & Pay Rs. ${fareAmount}`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;