import React, { useState } from "react";

const TwoFactorAuth = () => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    setEnabled(!enabled);
    // Later: Trigger backend call to enable/disable 2FA
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication (2FA)</h1>
      <p className="text-gray-500 mb-6">
        Enhance your account's security by requiring a second step of verification when logging in.
      </p>

      <div className="border border-base-300 rounded-xl p-5 max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Enable 2FA</h2>
            <p className="text-sm text-gray-500">
              Use an authentication app like Google Authenticator or Authy.
            </p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={enabled}
            onChange={handleToggle}
          />
        </div>

        {enabled && (
          <div className="space-y-4 mt-4 border-t pt-4 border-base-300">
            <p className="text-sm text-gray-500">
              Use your authenticator app to scan the QR code or enter the setup key manually.
            </p>
            <div className="w-40 h-40 bg-base-200 rounded-lg flex items-center justify-center text-gray-400">
              QR Code (Coming Soon)
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full">Verify & Activate</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
