import React from "react";
import { NavLink } from "react-router-dom";
import { Users, FileText, Flag, Mail, LayoutDashboard, Home } from "lucide-react";

const AdminSidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },  
    { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Posts", icon: <FileText size={20} />, path: "/admin/posts" },
    { name: "Reports", icon: <Flag size={20} />, path: "/admin/reports" },
    { name: "Messages", icon: <Mail size={20} />, path: "/admin/contact-us" },
    {name: "Go Back", icon: <Home size={20}/>, path: "/"},
  ];
  

  return (
    <div className="w-72 min-h-screen bg-base-100 shadow-xl border-r border-gray-300 p-6 sticky top-0 left-0">
      <h1 className="text-3xl font-semibold text-primary mb-8 text-center tracking-wide">Admin Panel</h1>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg text-[17px] font-medium tracking-wide transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-base-200 dark:hover:bg-gray-800 hover:text-primary"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
