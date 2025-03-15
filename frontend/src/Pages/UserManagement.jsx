import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaSort, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

const UserManagement = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
  });
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/user/admin/user-stats", {
        withCredentials: true,
      })
      .then((res) => setUserStats(res.data.userStats));
    axios
      .get("http://localhost:5000/api/v1/user/admin/users", {
        withCredentials: true,
      })
      .then((res) => {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(value))
    );
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sortedData = [...filteredUsers].sort((a, b) => {
      return order === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
    setFilteredUsers(sortedData);
  };

  const handleDelete = async (userId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/user/admin/delete/${userId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setOpenDialog(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }finally{
      setOpenDialog(false);
    }
  };

  const handleEditNavigation = (userId) => {
    navigate(`/admin/user/${userId}/edit`);
  };
  return (
    <div className="p-6 space-y-6">
      {/* User Stats Chart & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <Bar
            data={{
              labels: ["Total Users", "New Users", "Active Users"],
              datasets: [
                {
                  label: "User Stats",
                  data: [
                    userStats.totalUsers,
                    userStats.newUsers,
                    userStats.activeUsers,
                  ],
                  backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
                },
              ],
            }}
          />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg flex flex-col gap-3">
          <h2 className="text-xl font-semibold">User Stats Overview</h2>
          <p>
            Total Users:{" "}
            <span className="font-bold">{userStats.totalUsers}</span>
          </p>
          <p>
            New Users: <span className="font-bold">{userStats.newUsers}</span>
          </p>
          <p>
            Active Users:{" "}
            <span className="font-bold">{userStats.activeUsers}</span>
          </p>
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
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-base-300 shadow-md">
              <tr>
                <th className="p-4 text-start">Sr. No.</th>
                <th
                  className="p-4 text-start cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username <FaSort className="inline ml-1" />
                </th>
                <th
                  className="p-4 text-start cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email <FaSort className="inline ml-1" />
                </th>
                <th className="p-4 text-start">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="even:bg-base-200 odd:bg-base-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.isAdmin ? "Admin" : "User"}</td>
                  <td className="p-4 flex justify-center items-center gap-4">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEditNavigation(user._id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setOpenDialog(!openDialog);
                        setSelectedUser(user);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          onInteractOutside={() => setOpenDialog(false)}
          className="max-w-xl p-0 flex flex-col bg-base-100 text-base-content"
        >
          <VisuallyHidden>
            <DialogTitle>confirm delete</DialogTitle>
            <DialogDescription>
              admin confirmation for delete the user
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col justify-center items-center p-6 gap-4">
            <div className="text-xl font-bold">
              <p>Are you sure to delete {selectedUser?.username} ?</p>
            </div>
            <div className="flex gap-10 justify-center">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  handleDelete(selectedUser?._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
