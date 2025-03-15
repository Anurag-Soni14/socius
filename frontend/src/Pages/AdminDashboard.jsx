import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState("daily");

  // Dummy Data for Different Timeframes
  const userStats = {
    daily: [50, 70, 60, 90, 100, 80, 75],
    weekly: [300, 500, 450, 700, 600, 750, 800],
    monthly: [2000, 2500, 2700, 2900, 3100, 3500, 3700],
  };

  const postStats = {
    daily: [30, 50, 40, 70, 90, 60, 80],
    weekly: [210, 300, 290, 450, 400, 480, 500],
    monthly: [1500, 1800, 1900, 2000, 2100, 2200, 2300],
  };

  const reportStats = {
    daily: [5, 10, 7, 12, 15, 8, 9],
    weekly: [30, 50, 40, 70, 60, 75, 80],
    monthly: [200, 250, 270, 290, 310, 350, 370],
  };

  const userGrowthChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "User Growth",
        data: userStats[timeframe],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
      },
    ],
  };

  const postChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Posts Per Day",
        data: postStats[timeframe],
        backgroundColor: "#22C55E",
      },
    ],
  };

  const reportChart = {
    labels: ["Spam", "Harassment", "Fake News", "Scam"],
    datasets: [
      {
        data: [50, 30, 20, 40],
        backgroundColor: ["#EF4444", "#F97316", "#EAB308", "#3B82F6"],
      },
    ],
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Timeframe Selector */}
      <div className="col-span-3 flex justify-end space-x-3">
        {['daily', 'weekly', 'monthly'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-md font-bold ${timeframe === period ? 'bg-primary text-white' : 'bg-base-300 text-base-content'}`}
            onClick={() => setTimeframe(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* User Statistics */}
      <div className="col-span-2 p-6 bg-base-100 shadow-md rounded-lg">
        <h2 className="font-bold text-lg">User Growth</h2>
        <Line data={userGrowthChart} />
      </div>
      
      {/* Post Insights */}
      <div className="p-6 bg-base-100 shadow-md rounded-lg">
        <h2 className="font-bold text-lg">Posts Per Day</h2>
        <Bar data={postChart} />
      </div>

      {/* Report Overview */}
      <div className="p-6 bg-base-100 shadow-md rounded-lg">
        <h2 className="font-bold text-lg">Report Breakdown</h2>
        <Pie data={reportChart} />
      </div>

      {/* Survey Form */}
      <div className="col-span-2 p-6 bg-base-100 shadow-md rounded-lg">
        <h2 className="font-bold text-lg">Create a Survey</h2>
        <input
          type="text"
          placeholder="Enter your survey question..."
          className="w-full p-2 border rounded-md mt-2"
        />
        <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md">
          Send Survey
        </button>
      </div>

      {/* Send Notification */}
      <div className="bg-base-100 shadow-md p-6 rounded-lg">
        <h2 className="font-bold text-lg">Send Notification</h2>
        <textarea
          placeholder="Type your message..."
          className="w-full p-2 border rounded-md mt-2"
        ></textarea>
        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md">
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
