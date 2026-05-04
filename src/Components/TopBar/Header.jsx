import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Header = ({ toggleSidebar, isSidebarVisible }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "System: Surge Pricing Active in Colombo", read: false },
    { id: 2, text: "Welcome to DashDrive!", read: true },
  ]);

  const [currentUser, setCurrentUser] = useState({
    name: "Loading...",
    role: "User",
    photo: "https://ui-avatars.com/api/?name=User&background=ccff00&color=000", // LIME GREEN AVATAR
  });

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("dashdrive_user"));
    if (userSession) {
      setCurrentUser({
        name: userSession.fullName || userSession.email.split("@")[0],
        role:
          userSession.role === "DRIVER"
            ? `Driver (ID: ${userSession.id})`
            : "Passenger",
        photo: `https://ui-avatars.com/api/?name=${userSession.fullName || "User"}&background=ccff00&color=000&font-size=0.33`,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dashdrive_user");
    navigate("/login");
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center fixed top-0 ${isSidebarVisible ? "left-72" : "left-0"} right-0 transition-all duration-300 z-30 font-sans`}
    >
      <div className="flex items-center w-1/3">
        <button
          onClick={toggleSidebar}
          className="text-gray-900 mr-4 focus:outline-none cursor-pointer hover:bg-gray-100 p-2 rounded-full transition"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() =>
              setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
            }
            className="relative text-gray-600 hover:text-gray-900 transition focus:outline-none p-2 rounded-full hover:bg-gray-100"
          >
            <FaBell className="text-xl" />
            <span className="absolute top-1 right-1 bg-gray-900 text-[#ccff00] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>
          {/* Dropdown omitted for brevity, matches previous logic but with gray-900 text */}
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none cursor-pointer group bg-gray-50 hover:bg-gray-100 py-1.5 px-1.5 pr-4 rounded-full transition border border-gray-100"
          >
            <img
              src={currentUser.photo}
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-col text-left hidden sm:flex">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500 font-medium leading-tight">
                {currentUser.role}
              </span>
            </div>
          </button>

          <div
            className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-gray-100 transition-all duration-300 transform ${isProfileDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
          >
            <div className="p-2 space-y-1">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center font-medium">
                <FaUser className="mr-3 text-gray-400" /> My Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center font-medium">
                <FaCog className="mr-3 text-gray-400" /> Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center font-bold"
              >
                <FaSignOutAlt className="mr-3" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
