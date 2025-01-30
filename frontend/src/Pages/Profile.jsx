import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleSettingsClick = () => {
    navigate("/account/settings");
  };

  const displayPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.saved;

  return (
    <div className="p-4 max-w-5xl mx-auto relative bg-base-100">
      {isLoggedInUserProfile ? (
        <button
          onClick={handleSettingsClick}
          className="absolute top-4 right-4 focus:outline-none"
          aria-label="Settings"
        >
          <Cog6ToothIcon className="w-6 h-6 text-base-content hover:text-primary" />
        </button>
      ) : null}

      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
        <Avatar className="size-24">
          <AvatarImage src={userProfile?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h1 className="text-lg font-semibold text-primary">{userProfile?.username}</h1>
          <h2 className="text-base-content">{userProfile?.fullname}</h2>
        </div>
      </div>

      <div className="mt-4 text-center sm:text-left">
        <p className="text-base-content">{userProfile?.bio}</p>
      </div>

      <div className="flex justify-center sm:justify-start gap-8 mt-4 text-sm text-base-content">
        <div>
          <span className="font-bold">{userProfile?.followers.length}</span>{" "}
          Followers
        </div>
        <div>
          <span className="font-bold">{userProfile?.followings.length}</span>{" "}
          Following
        </div>
      </div>

      <div className="flex justify-center sm:justify-start gap-6 border-b mt-8">
        <button
          className={`pb-2 ${
            activeTab === "posts"
              ? "font-bold border-b-2 border-primary"
              : "text-base-content"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`pb-2 ${
            activeTab === "saved"
              ? "font-bold border-b-2 border-primary"
              : "text-base-content"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {displayPosts.map((post, index) => (
          <div key={index} className="relative group cursor-pointer">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-40 object-cover rounded-md"
            />
            <div className="absolute rounded-md inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center text-white space-x-4">
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <FaRegHeart className="size-[22px]" />
                  <span>{post?.likes?.length}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <MessageCircle className="size-[22px]" />
                  <span>{post?.comments?.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
