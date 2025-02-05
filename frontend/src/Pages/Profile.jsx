import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Cog6ToothIcon, CameraIcon } from "@heroicons/react/24/outline";
import { FaRegHeart } from "react-icons/fa";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  setAuthUser,
  setSelectedUser,
  setUserProfile,
} from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;
  useGetUserProfile(userId);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(
    user?.followings?.includes(userProfile?._id) || false
  );
  const [userProfileFollowers, setUserProfileFollowers] = useState(
    userProfile?.followers?.length
  );
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleSettingsClick = () => {
    navigate("/account/settings");
  };

  const handleFollowAndUnfollow = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true } // Ensuring cookies are sent
      );

      // Ensure res.data exists before accessing it
      if (res && res.data) {
        if (res.data.success) {
          const updatedFollowers = isFollowing
            ? userProfileFollowers - 1
            : userProfileFollowers + 1;
          setUserProfileFollowers(updatedFollowers);
          setIsFollowing(!isFollowing);
          dispatch(setAuthUser(res.data.user));
          dispatch(setUserProfile(res.data.followingUser));
          toast.success(res.data.message);
        } else {
          toast.info(res.data.message);
        }
      } else {
        toast.error("Unexpected response structure");
      }
    } catch (error) {
      // Handle error gracefully
      toast.error(error?.response?.data?.message || "An error occurred.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = () => {
    dispatch(setSelectedUser(userProfile));

    if (userProfile) {
      navigate(`/message`);
    } else {
      console.log("User profile not available.");
    }
  };

  const displayPosts =
    activeTab === "posts"
      ? userProfile?.isPrivate && !userProfile?.followings?.includes(user?._id)
        ? [] // Hide posts if the user is private and not followed
        : userProfile?.posts
      : userProfile?.saved;

  const canViewPosts =
    userProfile?.privacy === "public" || isFollowing || isLoggedInUserProfile;
  const canViewSaved =
    userProfile?.privacy === "public" || isFollowing || isLoggedInUserProfile;

  return (
    <div className="max-w-5xl mx-auto bg-base-100 shadow-lg rounded-lg overflow-hidden h-full mt-1">
      {/* Cover Photo */}
      <div className="relative h-52 bg-gray-200">
        {userProfile?.coverPhoto ? (
          <img
            src={userProfile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary"></div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="px-6 py-4 relative">
        {/* Profile Picture */}
        <div className="absolute -top-12 left-6">
          <Avatar className="size-24 border-4 border-white shadow-lg">
            <AvatarImage src={userProfile?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Settings Button */}
        {isLoggedInUserProfile && (
          <button
            onClick={handleSettingsClick}
            className="absolute top-4 right-4 focus:outline-none text-gray-600 hover:text-primary"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-7 h-7" />
          </button>
        )}

        {/* User Details */}
        <div className="mt-8 sm:mt-0 pl-28 sm:pl-32">
          <h1 className="text-xl font-bold text-primary">
            {userProfile?.username}
          </h1>
          <h2 className="text-gray-500">{userProfile?.fullname}</h2>
          <p className="text-sm text-gray-600 mt-2">{userProfile?.bio}</p>

          {/* Location & Website */}
          <div className="text-sm text-gray-500 mt-1">
            {userProfile?.location && <p>{userProfile?.location}</p>}
            {userProfile?.website && (
              <a
                href={userProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {userProfile.website}
              </a>
            )}
          </div>

          {/* Follow & Message Buttons */}
          {!isLoggedInUserProfile && (
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleFollowAndUnfollow}
                className="px-4 py-2"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  ""
                )}
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>

              {!userProfile?.privacy && (
                <Button onClick={handleMessage} className="px-4 py-2">
                  Message
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Followers & Following Stats */}
        <div className="flex justify-start gap-8 mt-6 text-sm text-gray-700">
          <div>
            <span className="font-bold">{userProfileFollowers}</span> Followers
          </div>
          <div>
            <span className="font-bold">{userProfile?.followings?.length}</span>{" "}
            Following
          </div>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mt-3">
          {userProfile?.interests?.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-primary text-white rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center sm:justify-start gap-6 border-b mt-4 px-6">
        <button
          className={`pb-2 transition-all ${
            activeTab === "posts"
              ? "font-bold border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`pb-2 transition-all ${
            activeTab === "saved"
              ? "font-bold border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Posts / Saved Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 px-6 pb-6">
        {canViewPosts &&
          displayPosts?.map((post, index) => (
            <div
              key={index}
              className="relative group cursor-pointer rounded-lg overflow-hidden"
            >
              <img
                src={post?.image}
                alt="Post"
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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