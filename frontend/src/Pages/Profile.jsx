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
import useGetUser from "@/hooks/useGetUser";
import ProfileSkeleton from "@/skeletons/ProfileSkeleton";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;
  const { loading, error } = useGetUserProfile(userId);
  useGetUser();
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);
  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(user.followings.includes(userProfile._id));
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (userProfile?.posts) {
      setLocalPosts([...userProfile.posts]);
    }
  }, [userProfile?.posts]);

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
        { withCredentials: true }
      );
  
      if (res?.data?.success) {
        const updatedFollowers = isFollowing
          ? userProfileFollowers - 1
          : userProfileFollowers + 1;
        setUserProfileFollowers(updatedFollowers);
        setIsFollowing(!isFollowing);
        dispatch(setAuthUser(res.data.user));
  
        // 🔥 Re-fetch the full user profile to get updated posts with images
        const userProfileRes = await axios.get(
          `http://localhost:5000/api/v1/user/profile/${userId}`,
          { withCredentials: true }
        );
        dispatch(setUserProfile(userProfileRes.data.user));
  
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
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
      ? isLoggedInUserProfile || !userProfile?.isPrivate || isFollowing
        ? userProfile?.posts
        : [] // Hide posts only for other users if they haven't followed
      : userProfile?.saved;

  const canViewPosts =
    userProfile?.isPrivate === false || isFollowing || isLoggedInUserProfile;
  const canViewSaved = isLoggedInUserProfile; // Only profile owner can see saved tab

  return (
    <div className="max-w-5xl mx-auto bg-base-100 shadow-lg rounded-lg overflow-y-auto h-[99vh] mt-1">
      {loading && <ProfileSkeleton />}
      {error && <p className="text-red-500">{error}</p>}
      {/* Cover Photo */}
      <div className="relative h-52 bg-gray-200">
        {userProfile?.coverPhoto ? (
          <img
            src={userProfile?.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary"></div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="px-4 sm:px-6 py-4 relative">
        {/* Profile Picture */}
        <div className="absolute -top-12 left-4 sm:left-6">
          <Avatar className="size-20 sm:size-24 border-4 border-white shadow-lg">
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
            <Cog6ToothIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* User Details */}
        <div className="mt-8 sm:mt-0 pl-24 sm:pl-32">
          <h1 className="text-lg sm:text-xl font-bold text-primary">
            {userProfile?.username}
          </h1>
          <h2 className="text-gray-500 text-sm sm:text-base">
            {userProfile?.fullname}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {userProfile?.bio}
          </p>

          {/* Location & Website */}
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
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
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
              <Button onClick={handleFollowAndUnfollow} className="px-4 py-2">
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
        <div
          className="flex justify-start gap-4 sm:gap-8 mt-6 text-xs sm:text-sm text-gray-700 cursor-pointer"
          onClick={() =>
            navigate(`/profile/${userProfile?._id}/followers-following`)
          }
        >
          <div>
            <span className="font-bold">{userProfile?.followers.length}</span>{" "}
            Followers
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
      <div className="flex justify-center sm:justify-start gap-6 border-b mt-4 px-4 sm:px-6">
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
        {canViewSaved && (
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
        )}
      </div>

      {/* Posts Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 px-4 sm:px-6 pb-6">
        {canViewPosts ? (
          displayPosts?.length > 0 ? (
            displayPosts.map((post, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border-2"
              >
                {post?.image ? (
                  <img
                    src={post?.image}
                    alt="Post"
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-40 flex justify-center items-center px-3 object-cover transition-transform duration-300 group-hover:scale-105">
                    <p>{post?.caption}</p>
                  </div>
                )}
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
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-2 sm:col-span-3 mt-6">
              No posts available.
            </p>
          )
        ) : (
          <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center text-center py-10 bg-base-100 rounded-lg shadow-md">
            <img
              src="https://static.thenounproject.com/png/977881-200.png" // Replace with an appropriate lock/private icon
              alt="Private Profile"
              className="size-24 opacity-70"
            />
            <h2 className="text-lg font-semibold text-primary">
              This account is private
            </h2>
            <p className="text-base-content text-sm mt-2">
              Follow this account to see their posts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
