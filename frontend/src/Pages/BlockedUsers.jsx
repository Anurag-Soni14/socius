import React from "react";
import { Button } from "@/components/ui/button"; // shadcn/ui or your own button
import { FaUserAltSlash, FaUserCircle } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";

const blockedUsers = [
  {
    _id: "1",
    username: "john_doe",
    fullname: "John Doe",
    profilePic: "", // if blank, fallback to icon
  },
  {
    _id: "2",
    username: "jane_smith",
    fullname: "Jane Smith",
    profilePic: "",
  },
  {
    _id: "3",
    username: "mike_dev",
    fullname: "Mike Developer",
    profilePic: "",
  },
];

const BlockedUsers = () => {
  return (
    <div className="p-6 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-4">Blocked Users</h1>
      <p className="text-sm text-gray-500 mb-6">
        You’ve blocked the following users. Unblocking them will allow them to see your profile and interact with you again.
      </p>

      <div className="space-y-4">
        {blockedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 border rounded-xl bg-base-200 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <h2 className="text-lg font-medium">{user.fullname}</h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <FaUserAltSlash className="text-sm" />
                Unblock
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <IoEyeOutline />
                View
              </Button>
              <Button variant="secondary" size="sm" className="flex items-center gap-1">
                <HiOutlineMail />
                Message
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedUsers;
