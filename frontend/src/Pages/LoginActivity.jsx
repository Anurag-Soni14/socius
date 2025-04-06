import React from "react";

const LoginActivity = () => {
  const dummyLogins = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.10",
      date: "2025-04-05 14:33",
      current: true,
    },
    {
      id: 2,
      device: "Firefox on Linux",
      location: "Berlin, Germany",
      ip: "182.77.12.9",
      date: "2025-04-03 09:21",
      current: false,
    },
    {
      id: 3,
      device: "Safari on iPhone",
      location: "Tokyo, Japan",
      ip: "103.22.13.8",
      date: "2025-03-28 22:10",
      current: false,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-4">Login Activity</h1>
      <p className="text-gray-500 mb-6">
        View your recent logins across all devices and sessions. If something doesn’t look right, we recommend changing your password.
      </p>

      <div className="overflow-x-auto rounded-lg shadow border border-base-300">
        <table className="table w-full">
          <thead>
            <tr className="text-left bg-base-200">
              <th>Device</th>
              <th>Location</th>
              <th>IP Address</th>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyLogins.map((login) => (
              <tr key={login.id}>
                <td>{login.device}</td>
                <td>{login.location}</td>
                <td>{login.ip}</td>
                <td>{login.date}</td>
                <td>
                  {login.current ? (
                    <span className="badge badge-success">Current Session</span>
                  ) : (
                    <button className="btn btn-xs btn-outline">Logout</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginActivity;
