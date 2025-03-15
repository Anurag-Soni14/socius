import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Users, FileText, Flag, Mail, LayoutDashboard, Home } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },  
    { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Posts", icon: <FileText size={20} />, path: "/admin/posts" },
    { name: "Reports", icon: <Flag size={20} />, path: "/admin/reports" },
    { name: "Messages", icon: <Mail size={20} />, path: "/admin/contact-us" },
    {name: "Go Back", icon: <Home size={20}/>, path: "/"},
  ];
  

  return (
    <aside
      className={`bg-base-100 fixed top-0 left-0 z-20 h-screen w-72 transition-transform transform sm:sticky sm:top-0 sm:left-0 sm:translate-x-0 sm:w-16 xl:w-72 p-6 border-r border-gray-300 shadow-xl 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
    >
      {/* Toggle Button for Small Screens */}
      {!isOpen && (
        <button
          className="sm:hidden absolute top-4 left-[300px] text-base-content text-3xl"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {/* Close Button */}
      <button
        className="sm:hidden absolute top-4 right-4 text-base-content text-2xl"
        onClick={toggleSidebar}
      >
        X
      </button>

      {/* Sidebar Header */}
      <h1 className="text-3xl font-semibold text-primary mb-8 text-center tracking-wide sm:text-sm xl:text-3xl">
        Admin Panel
      </h1>

      {/* Sidebar Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg text-[17px] font-medium tracking-wide transition-all 
              ${isActive ? "bg-primary text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-base-200 dark:hover:bg-gray-800 hover:text-primary"}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 sm:hidden xl:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
