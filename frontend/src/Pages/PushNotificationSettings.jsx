import React, { useState } from "react";

const PushNotificationSettings = () => {
  const [settings, setSettings] = useState({
    likes: true,
    comments: true,
    followers: true,
    messages: true,
    mentions: false,
  });

  const toggleSetting = (type) => {
    setSettings((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">Push Notifications</h1>
      <p className="text-gray-500 mb-6">
        Manage which notifications you receive on your device.
      </p>

      <div className="space-y-4 max-w-xl">
        {[
          { label: "Likes", type: "likes" },
          { label: "Comments", type: "comments" },
          { label: "New Followers", type: "followers" },
          { label: "Messages", type: "messages" },
          { label: "Mentions", type: "mentions" },
        ].map(({ label, type }) => (
          <div
            key={type}
            className="flex items-center justify-between bg-base-200 rounded-xl px-4 py-3 shadow-sm"
          >
            <span className="text-base font-medium">{label}</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings[type]}
              onChange={() => toggleSetting(type)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
};

export default PushNotificationSettings;
