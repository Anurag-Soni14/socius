import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaSort, FaEdit, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [userStats, setUserStats] = useState({ totalUsers: 0, newUsers: 0, activeUsers: 0 });
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  
  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/user/admin/user-stats", { withCredentials: true })
      .then((res) => setUserStats(res.data.data));
    axios.get("http://localhost:5000/api/v1/user/admin/users", { withCredentials: true })
      .then((res) => {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(value)));
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sortedData = [...filteredUsers].sort((a, b) => {
      return order === "asc" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
    });
    setFilteredUsers(sortedData);
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Stats Chart & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <Bar data={{
            labels: ["Total Users", "New Users", "Active Users"],
            datasets: [{
              label: "User Stats",
              data: [userStats.totalUsers, userStats.newUsers, userStats.activeUsers],
              backgroundColor: ["#4caf50", "#ff9800", "#2196f3"]
            }]
          }} />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg flex flex-col gap-3">
          <h2 className="text-xl font-semibold">User Stats Overview</h2>
          <p>Total Users: <span className="font-bold">{userStats.totalUsers}</span></p>
          <p>New Users: <span className="font-bold">{userStats.newUsers}</span></p>
          <p>Active Users: <span className="font-bold">{userStats.activeUsers}</span></p>
        </div>
      </div>

      {/* User Table with Search, Sort & Filter */}
      <div className="bg-base-100 shadow-md p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="p-2 border rounded-lg" 
            value={searchText} 
            onChange={handleSearch} 
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-neutral text-white">
                <th className="border p-2">Sr. No.</th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort("username")}>Username <FaSort className="inline ml-1" /></th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort("email")}>Email <FaSort className="inline ml-1" /></th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.isAdmin ? "Admin" : "User"}</td>
                  <td className="border p-2 flex gap-4 justify-center">
                    <button className="bg-green-500 text-white px-3 py-1 rounded"><FaEdit /></button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;