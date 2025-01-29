import React from "react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();

  const settings = [
    { category: "Profile", options: [{ name: "Edit Profile", path: "/account/settings/edit-profile" }, { name: "Personal Info", path: "/personal-info" }, { name: "Change Theme", path: "/change-theme" }] },
    { category: "Manage", options: [{ name: "Liked", path: "/liked" }, { name: "Comments", path: "/comments" }, { name: "Saved", path: "/saved" }, { name: "Delete Account", path: "/delete-account" }] },
    { category: "Privacy", options: [{ name: "Blocked Users", path: "/blocked-users" }, { name: "Activity Status", path: "/activity-status" }, { name: "Who Can Message You", path: "/message-privacy" }] },
    { category: "Notifications", options: [{ name: "Push Notifications", path: "/push-notifications" }, { name: "Email Alerts", path: "/email-alerts" }, { name: "SMS Notifications", path: "/sms-notifications" }] },
    { category: "Security", options: [{ name: "Change Password", path: "/change-password" }, { name: "Two-Factor Authentication", path: "/2fa" }, { name: "Login Activity", path: "/login-activity" }] },
    { category: "Preferences", options: [{ name: "Language", path: "/language" }, { name: "Content Preferences", path: "/content-preferences" }, { name: "Data Usage", path: "/data-usage" }] },
    { category: "Other", options: [{ name: "Help", path: "/help" }, { name: "About Us", path: "/about-us" }, { name: "Contact Us", path: "/contact-us" }, { name: "Report", path: "/report" }] },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Settings</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((section, index) => (
          <div key={index} className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">{section.category}</h3>
            <ul className="space-y-2">
              {section.options.map((option, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 bg-white rounded-md cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleNavigation(option.path)}
                >
                  {option.name} <span className="font-bold">→</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Setting;
