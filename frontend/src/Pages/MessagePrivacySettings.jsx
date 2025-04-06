import React, { useState } from "react";

const MessagePrivacySettings = () => {
  const [setting, setSetting] = useState("followers"); // default option

  const handleChange = (e) => {
    setSetting(e.target.value);
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">Who Can Message You</h1>
      <p className="text-gray-500 mb-6">
        Choose who is allowed to send you direct messages.
      </p>

      <div className="space-y-4 max-w-lg">
        <div className="p-4 rounded-xl bg-base-200 shadow-sm">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="messageSetting"
              value="everyone"
              checked={setting === "everyone"}
              onChange={handleChange}
              className="radio radio-primary"
            />
            <span className="text-base font-medium">Everyone</span>
          </label>
          <p className="text-sm text-gray-500 pl-8">
            Anyone on the platform can send you a message.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="messageSetting"
              value="followers"
              checked={setting === "followers"}
              onChange={handleChange}
              className="radio radio-primary"
            />
            <span className="text-base font-medium">Only Followers</span>
          </label>
          <p className="text-sm text-gray-500 pl-8">
            Only people who follow you can message you.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="messageSetting"
              value="following"
              checked={setting === "following"}
              onChange={handleChange}
              className="radio radio-primary"
            />
            <span className="text-base font-medium">Only Who You Follow</span>
          </label>
          <p className="text-sm text-gray-500 pl-8">
            Only users you follow can message you.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="messageSetting"
              value="noone"
              checked={setting === "noone"}
              onChange={handleChange}
              className="radio radio-primary"
            />
            <span className="text-base font-medium">No One</span>
          </label>
          <p className="text-sm text-gray-500 pl-8">
            Block all incoming messages from everyone.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );
};

export default MessagePrivacySettings;
