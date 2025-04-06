import React, { useState } from "react";

const EmailAlertSettings = () => {
  const [alerts, setAlerts] = useState({
    login: true,
    newFollower: false,
    mentions: true,
    weeklyDigest: false,
    security: true,
  });

  const toggleAlert = (key) => {
    setAlerts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">Email Alerts</h1>
      <p className="text-gray-500 mb-6">
        Choose which updates we should send you via email.
      </p>

      <div className="space-y-4 max-w-xl">
        {[
          { label: "Login Alerts", key: "login" },
          { label: "New Followers", key: "newFollower" },
          { label: "Mentions", key: "mentions" },
          { label: "Weekly Digest", key: "weeklyDigest" },
          { label: "Security Updates", key: "security" },
        ].map(({ label, key }) => (
          <div
            key={key}
            className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-3 shadow-sm"
          >
            <span className="text-base font-medium">{label}</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={alerts[key]}
              onChange={() => toggleAlert(key)}
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

export default EmailAlertSettings;
