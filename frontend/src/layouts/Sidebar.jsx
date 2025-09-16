import React, { useState } from "react";
import {
  FaUserInjured,
  FaMoneyBillWave,
  FaBoxes,
  FaCalendarAlt,
  FaChartBar,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHospitalSymbol,
  FaUserCog,
} from "react-icons/fa";
import Avater from "../assets/image/logo/avater.png";

const Sidebar = ({ activePage, setActivePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "রোগী ব্যবস্থাপনা",
      icon: <FaUserInjured className="text-xl" />,
      color: "#6F00FF",
    },
    {
      id: 2,
      name: "বিলিং ও ইনভয়েসিং",
      icon: <FaMoneyBillWave className="text-xl" />,
      color: "rgb(16, 185, 129)",
    },
    {
      id: 3,
      name: "ইনভেন্টরি ব্যবস্থাপনা",
      icon: <FaBoxes className="text-xl" />,
      color: "rgb(245, 158, 11)",
    },
    {
      id: 4,
      name: "অ্যাপয়েন্টমেন্ট সময়সূচী",
      icon: <FaCalendarAlt className="text-xl" />,
      color: "rgb(139, 92, 246)",
    },
    {
      id: 5,
      name: "রিপোর্টিং",
      icon: <FaChartBar className="text-xl" />,
      color: "rgb(236, 72, 153)",
    },
    {
      id: 6,
      name: "Docotrs",
      icon: <FaChartBar className="text-xl" />,
      color: "#3B0270",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMenuItemClick = (itemName) => {
    setActivePage(itemName);
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleAdminProfileClick = () => {
    setActivePage("অ্যাডমিন প্রোফাইল");
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-5 left-4 z-50">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-[#008CBA] text-white text-2xl"
        >
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`font-roboto bg-gray-900 text-white h-screen flex flex-col fixed md:relative z-40 transition-all duration-300 ${
          isMobileSidebarOpen ? "left-0" : "-left-64"
        } md:left-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div
            className={`flex items-center ${
              !isSidebarOpen && "justify-center w-full"
            }`}
          >
            {/* <FaHospitalSymbol className="text-2xl text-blue-400" /> */}
            {isSidebarOpen && (
              <h1 className="text-xl font-bold ml-11 md:ml-2">হাসপাতাল POS</h1>
            )}
          </div>

          {/* Desktop toggle button - hidden on mobile */}
          <button
            onClick={toggleSidebar}
            className="hidden md:block text-gray-400 hover:text-white text-2xl"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.name)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activePage === item.name
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  style={
                    activePage === item.name
                      ? { backgroundColor: item.color }
                      : {}
                  }
                >
                  <span
                    className="flex-shrink-0"
                    style={{
                      color: activePage === item.name ? "white" : item.color,
                    }}
                  >
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleAdminProfileClick}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              activePage === "অ্যাডমিন প্রোফাইল"
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            } ${!isSidebarOpen && "justify-center"}`}
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-10 h-10 overflow-hidden rounded-full bg-amber-200">
                  <img
                    className="w-full h-full object-cover"
                    src={Avater}
                    alt="Profile logo"
                  />
                </div>
              </div>
            </div>
            {isSidebarOpen && (
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">অ্যাডমিন</p>
                <p className="text-xs text-gray-400">admin@hospital.com</p>
              </div>
            )}
          </button>

          {/* Logout button */}
          <button
            className={`w-full flex items-center p-3 mt-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <FaSignOutAlt />
            {isSidebarOpen && <span className="ml-3">লগআউট</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
