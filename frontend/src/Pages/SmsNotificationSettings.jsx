import React, { useState } from "react";

const SmsNotificationSettings = () => {
  const [smsSettings, setSmsSettings] = useState({
    login: true,
    suspiciousActivity: false,
    newFollower: false,
    passwordChange: true,
  });

  const toggleSetting = (key) => {
    setSmsSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">SMS Notifications</h1>
      <p className="text-gray-500 mb-6">
        Manage the events for which you’d like to receive SMS notifications.
      </p>

      <div className="space-y-4 max-w-xl">
        {[
          { label: "Login Alerts", key: "login" },
          { label: "Suspicious Activity", key: "suspiciousActivity" },
          { label: "New Followers", key: "newFollower" },
          { label: "Password Change", key: "passwordChange" },
        ].map(({ label, key }) => (
          <div
            key={key}
            className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-3 shadow-sm"
          >
            <span className="text-base font-medium">{label}</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={smsSettings[key]}
              onChange={() => toggleSetting(key)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="btn btn-primary">Save Preferences</button>
      </div>
    </div>
  );
};

export default SmsNotificationSettings;
