import {
  FaTachometerAlt,
  FaCar,
  FaMapMarkerAlt,
  FaHistory,
  FaMoneyCheckAlt,
  FaStar,
  FaClipboardList,
  FaPlusCircle,
  FaTags,
  FaCog,
  FaUserCircle
} from "react-icons/fa";

// --- CUSTOMER NAVIGATION ---
export const customerNavItems = [
  { sectionTitle: "MAIN" },
  { id: "dashboard", path: "/customer/dashboard", label: "Dashboard", icon: FaTachometerAlt, subItems: [] },

  { sectionTitle: "RIDE ENGINE" },
  {
    id: "bookings",
    path: "/bookings",
    label: "My Rides",
    icon: FaMapMarkerAlt,
    subItems: [
      { id: "request-ride", path: "/bookings/request", label: "Request a Ride", icon: FaPlusCircle },
      { id: "ride-history", path: "/bookings", label: "Ride History", icon: FaHistory },
    ],
  },
  { id: "pricing", path: "/pricing", label: "Fare Estimates", icon: FaTags, subItems: [] },

  { sectionTitle: "ACCOUNTING & FEEDBACK" },
  { id: "payments", path: "/payments/checkout", label: "Billing History", icon: FaMoneyCheckAlt, subItems: [] },
  { id: "reviews", path: "/reviews/submit", label: "My Reviews", icon: FaStar, subItems: [] },

  { sectionTitle: "SYSTEM" },
  { id: "profile", path: "/profile", label: "My Profile", icon: FaUserCircle, subItems: [] },
];

// --- DRIVER NAVIGATION ---
export const driverNavItems = [
  { sectionTitle: "MAIN" },
  { id: "dashboard", path: "/driver/dashboard", label: "Dashboard", icon: FaTachometerAlt, subItems: [] },

  { sectionTitle: "FLEET & JOBS" },
  {
    id: "vehicles",
    path: "/vehicles",
    label: "My Fleet",
    icon: FaCar,
    subItems: [
      { id: "all-vehicles", path: "/vehicles", label: "Manage Vehicles", icon: FaClipboardList },
      { id: "add-vehicle", path: "/vehicles/add", label: "Register Vehicle", icon: FaPlusCircle },
    ],
  },
  { id: "bookings", path: "/driver/jobs", label: "Active Jobs", icon: FaMapMarkerAlt, subItems: [] },

  { sectionTitle: "EARNINGS & PERFORMANCE" },
  { id: "payments", path: "/payments", label: "Earnings Report", icon: FaMoneyCheckAlt, subItems: [] },
  { id: "reviews", path: "/reviews", label: "My Ratings", icon: FaStar, subItems: [] },

  { sectionTitle: "SYSTEM" },
  { id: "profile", path: "/profile", label: "My Profile", icon: FaUserCircle, subItems: [] },
];