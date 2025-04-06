import React, { useState } from "react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: Validate & call backend API
    console.log("Password changed:", formData);
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">Change Password</h1>
      <p className="text-gray-500 mb-6">
        Ensure your account is using a long, random password to stay secure.
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label className="label">
            <span className="label-text font-medium">Current Password</span>
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Confirm New Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
