import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages (Member 01)
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import NotFound from "../Pages/NotFound/NotFound";

// Security & Layout
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute"; 
import MainLayout from "../layout/MainLayout";

// Dashboards
import CustomerDashboard from "../Pages/Dashboard/CustomerDashboard";
import DriverDashboard from "../Pages/Dashboard/DriverDashboard";

// Fleet Management (Member 02 - Janith)
import VehicleList from "../Pages/Vehicles/VehicleList";
import AddVehicleForm from "../Pages/Vehicles/AddVehicleForm";

// Booking Engine (Member 03)
import RequestRide from "../Pages/Bookings/RequestRide";
import BookingHistory from "../Pages/Bookings/BookingHistory";

// Pricing Module (Member 04)
import FareEstimator from "../Pages/Pricing/FareEstimator";

// Reviews (Member 05)
import SubmitReview from "../Pages/Reviews/SubmitReview";

// Payments (Member 06)
import PaymentCheckout from "../Pages/Payments/PaymentCheckout";


function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* ----------------- PUBLIC ROUTES ----------------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ----------------- CUSTOMER SECURE ROUTES ----------------- */}
        {/* By not putting a 'path' here, this just acts as a security wrapper! */}
        <Route element={ <RoleRoute allowedRole="CUSTOMER"><MainLayout /></RoleRoute> }>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
          {/* Member 03 (Booking) Routes */}
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/bookings/request" element={<RequestRide />} />

          {/* Member 04 (Pricing) Route */}
          <Route path="/pricing" element={<FareEstimator />}  />

          {/* Member 05 (Reviews) Route */}
          <Route path="/reviews/submit" element={<SubmitReview />} />

          {/* Member 06 (Payments) Route */}
          <Route path="/payments/checkout" element={<PaymentCheckout />} />
        </Route>

        {/* ----------------- DRIVER SECURE ROUTES ----------------- */}
        <Route element={ <RoleRoute allowedRole="DRIVER"><MainLayout /></RoleRoute> }>
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          
          {/* Janith's Fleet Management Routes */}
          <Route path="/vehicles" element={<VehicleList />} /> 
          <Route path="/vehicles/add" element={<AddVehicleForm />} />
        </Route>

        {/* ----------------- FALLBACK ROUTES ----------------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;