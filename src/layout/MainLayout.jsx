import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/TopBar/Header";
import Sidebar from "../Components/Sidebar/SideBar";

const MainLayout = () => {
  // State to handle opening and closing the sidebar on mobile/desktop
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      
      {/* 1. The Dynamic Sidebar (Left Side) */}
      <Sidebar isVisible={isSidebarVisible} />

      {/* 2. The Main Content Wrapper (Right Side) */}
      <div
        className={`flex flex-col flex-1 h-full transition-all duration-300 ${
          isSidebarVisible ? "lg:ml-72 ml-0" : "md:ml-0 ml-0"
        }`}
      >
        {/* The Top Navigation Bar */}
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarVisible={isSidebarVisible}
        />

        {/* 3. The Outlet Area
          This is the "Stage" where React Router dynamically swaps out the pages 
          (e.g., swapping CustomerDashboard for RequestRide) while keeping the Header and Sidebar intact. 
        */}
        <main className="flex-1 overflow-y-auto mt-15  custom-scrollbar">
          <Outlet />
        </main>

      </div>
      
      {/* Mobile Overlay Background (Closes sidebar when clicking outside on small screens) */}
      {isSidebarVisible && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;