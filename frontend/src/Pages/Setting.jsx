import React from "react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();

  const settings = [
    {
      category: "Profile",
      options: [
        { name: "Edit Profile", path: "/account/settings/edit-profile" },
        { name: "Personal Info", path: "/account/personal-info" },
        { name: "Change Theme", path: "/account/settings/change-theme" },
      ],
    },
    {
      category: "Manage",
      options: [
        { name: "Liked", path: "/account/liked-post" },
        { name: "Comments", path: "/account/commented-post" },
        { name: "Saved", path: "/account/saved-post" },
        { name: "Delete Account", path: "/delete-account" },
      ],
    },
    {
      category: "Privacy",
      options: [
        { name: "Blocked Users", path: "/account/blocked-users" },
        { name: "Activity Status", path: "/my-activity" },
        { name: "Who Can Message You", path: "/message-privacy" },
      ],
    },
    {
      category: "Notifications",
      options: [
        { name: "Push Notifications", path: "/push-notifications" },
        { name: "Email Alerts", path: "/email-alerts" },
        { name: "SMS Notifications", path: "/sms-notifications" },
      ],
    },
    {
      category: "Security",
      options: [
        { name: "Change Password", path: "/change-password" },
        { name: "Two-Factor Authentication", path: "/security/2fa" },
        { name: "Login Activity", path: "/security/login-activity" },
      ],
    },
    {
      category: "Other",
      options: [
        { name: "Help", path: "/account/help" },
        { name: "About Us", path: "/about-us" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "Report", path: "/account/report" },
      ],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Settings
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((section, index) => (
          <div key={index} className="bg-base-200 p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-base-content">
              {section.category}
            </h3>
            <div className="space-y-2">
              {section.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(option.path)}
                  className="w-full text-left flex justify-between items-center p-3 bg-primary text-white rounded-md hover:bg-primary-focus focus:outline-none transition duration-200"
                >
                  <span>{option.name}</span>
                  <span className="font-bold">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Setting;
