import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts"); // Tabs: posts or saved

  // Example User Data
  const user = {
    profilePic:
      "https://res.cloudinary.com/drqk7plvb/image/upload/v1735978308/daxdk3mg36vs7qqee8yv.jpg", // Replace with user profile pic URL
    username: "john_doe",
    fullname: "John Doe",
    bio: "A passionate traveler and photographer.",
    followers: 1200,
    following: 345,
    posts: [
      { id: 1, image: "https://via.placeholder.com/150" },
      { id: 2, image: "https://via.placeholder.com/150" },
    ],
    saved: [
      { id: 3, image: "https://via.placeholder.com/150" },
      { id: 4, image: "https://via.placeholder.com/150" },
    ],
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
        {/* Profile Picture */}
        <Avatar className="size-24">
          <AvatarImage src={user?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h1 className="text-lg font-semibold">{user.username}</h1>
          <h2 className="text-gray-600">{user.fullname}</h2>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-4 text-center sm:text-left">
        <p className="text-gray-500">{user.bio}</p>
      </div>

      {/* Followers and Following */}
      <div className="flex justify-center sm:justify-start gap-8 mt-4 text-sm text-gray-700">
        <div>
          <span className="font-bold">{user.followers}</span> Followers
        </div>
        <div>
          <span className="font-bold">{user.following}</span> Following
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center sm:justify-start gap-6 border-b mt-8">
        <button
          className={`pb-2 ${
            activeTab === "posts"
              ? "font-bold border-b-2 border-black"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`pb-2 ${
            activeTab === "saved"
              ? "font-bold border-b-2 border-black"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Posts / Saved Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {activeTab === "posts"
          ? user.posts.map((post) => (
              <img
                key={post.id}
                src={post.image}
                alt="Post"
                className="w-full h-40 object-cover rounded-md"
              />
            ))
          : user.saved.map((saved) => (
              <img
                key={saved.id}
                src={saved.image}
                alt="Saved"
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
      </div>
    </div>
  );
};

export default ProfilePage;
