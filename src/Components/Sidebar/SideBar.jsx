import { useLocation, useNavigate } from "react-router-dom";
import { customerNavItems, driverNavItems } from "../../config/navigation";
import { FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Sidebar = ({ isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("dashdrive_user"));
  const navItems = user?.role === "DRIVER" ? driverNavItems : customerNavItems;

  const [expandedTabs, setExpandedTabs] = useState(() => {
    const currentMainPath = location.pathname.split("/")[1];
    const activeItem = navItems.find(
      (item) => item.path && item.path.includes(currentMainPath),
    );
    return new Set(activeItem ? [activeItem.id] : []);
  });

  const activeItemRef = useRef(null);

  const toggleExpanded = (tabId, hasSubItems) => {
    if (!hasSubItems) return;
    setExpandedTabs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) newSet.delete(tabId);
      else newSet.add(tabId);
      return newSet;
    });
  };

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [location.pathname]);

  return (
    <div
      className={`bg-white border-r border-gray-100 min-h-screen px-4 w-72 fixed left-0 top-0 transition-transform duration-300 ease-in-out z-40 ${isVisible ? "translate-x-0" : "-translate-x-full"} h-screen overflow-y-auto custom-scrollbar font-sans`}
    >
      {/* --- DASHDRIVE LOGO --- */}
      <div className="sticky top-0 bg-white z-10 py-6 px-2 border-b border-gray-50 mb-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() =>
            navigate(
              user?.role === "DRIVER"
                ? "/driver/dashboard"
                : "/customer/dashboard",
            )
          }
        >
          <div className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center text-gray-900 font-extrabold text-xl shadow-sm">
            D
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">
              Dash Drive
            </h1>
            <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
              {user?.role === "DRIVER" ? "Driver Portal" : "Passenger"}
            </span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="pb-10">
        <ul className="space-y-1.5">
          {navItems.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            if (item.sectionTitle) {
              return (
                <li
                  key={index}
                  className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 mb-3"
                >
                  {item.sectionTitle}
                </li>
              );
            }

            const isActive = location.pathname.startsWith(item.path);
            return (
              <div key={item.id}>
                <li>
                  <button
                    ref={isActive ? activeItemRef : null}
                    onClick={() => {
                      if (!hasSubItems) handleNavigation(item.path);
                      toggleExpanded(item.id, hasSubItems);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive ? "bg-[#ccff00] text-gray-900 font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <item.icon
                          className={`text-lg mr-3 ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"}`}
                        />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {hasSubItems && (
                      <div
                        className={`transform transition-transform duration-300 ${expandedTabs.has(item.id) ? "rotate-180" : "rotate-0"}`}
                      >
                        <FaChevronDown
                          className={`text-xs ${isActive ? "text-gray-900" : "text-gray-400"}`}
                        />
                      </div>
                    )}
                  </button>

                  {hasSubItems && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out`}
                      style={{
                        maxHeight: expandedTabs.has(item.id) ? "500px" : "0",
                        opacity: expandedTabs.has(item.id) ? "1" : "0",
                      }}
                    >
                      <ul className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-2">
                        {item.subItems.map((subItem) => {
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <li key={subItem.id}>
                              <button
                                ref={isSubActive ? activeItemRef : null}
                                onClick={() => handleNavigation(subItem.path)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${isSubActive ? "text-gray-900 font-bold bg-[#faffeb]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"}`}
                              >
                                {subItem.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              </div>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
