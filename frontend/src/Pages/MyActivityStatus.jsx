import React from "react";
import { FaUserCircle, FaRegCalendarCheck, FaHeart, FaCommentDots } from "react-icons/fa";
import { MdPostAdd, MdLogin } from "react-icons/md";
import { useSelector } from "react-redux";

const MyActivityStatus = () => {
  // This would come from auth state later
  const user = {
    fullname: "John Doe",
    username: "john_doe",
    profilePic: "",
    joinedAt: "2023-08-12T10:00:00Z",
    lastLogin: "2025-04-05T21:30:00Z",
    totalPosts: 12,
    totalLikes: 76,
    totalComments: 24,
  };

  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-2">My Activity Status</h1>
      <p className="text-gray-500 mb-6">Overview of your activity on the platform</p>

      <div className="flex items-center space-x-4 mb-6">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-16 h-16 text-gray-400" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.fullname}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-base-200 shadow-sm flex items-center gap-4">
          <MdPostAdd className="text-3xl text-primary" />
          <div>
            <h3 className="text-xl font-bold">{user.totalPosts}</h3>
            <p className="text-gray-500 text-sm">Total Posts</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm flex items-center gap-4">
          <FaHeart className="text-3xl text-red-500" />
          <div>
            <h3 className="text-xl font-bold">{user.totalLikes}</h3>
            <p className="text-gray-500 text-sm">Total Likes</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm flex items-center gap-4">
          <FaCommentDots className="text-3xl text-blue-500" />
          <div>
            <h3 className="text-xl font-bold">{user.totalComments}</h3>
            <p className="text-gray-500 text-sm">Comments Made</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm flex items-center gap-4">
          <FaRegCalendarCheck className="text-3xl text-green-500" />
          <div>
            <h3 className="text-md font-semibold">
              {new Date(user.joinedAt).toLocaleDateString()}
            </h3>
            <p className="text-gray-500 text-sm">Joined On</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-base-200 shadow-sm flex items-center gap-4">
          <MdLogin className="text-3xl text-yellow-600" />
          <div>
            <h3 className="text-md font-semibold">
              {new Date(user.lastLogin).toLocaleString()}
            </h3>
            <p className="text-gray-500 text-sm">Last Login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivityStatus;
