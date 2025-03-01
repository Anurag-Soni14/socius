import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser, setUserProfile } from "../redux/authSlice";
import { toast } from "sonner";
import FollowButton from "./FollowButton";

const UserInfoWithButton = ({ user }) => {
  const dispatch = useDispatch();
  const userId = user?._id;
  const { user: authUser } = useSelector((store) => store.auth);

  // Local state for tracking follow status
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowedByUser, setIsFollowedByUser] = useState(false); // New state for follow-back check
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authUser && userId) {
      setIsFollowing(authUser?.followings?.includes(userId));
      setIsFollowedByUser(user?.followers?.includes(authUser?._id)); // Check if the target user follows authUser
    }
  }, [authUser, userId, user?.followers]);

  const handleFollowAndUnfollow = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );


      if (res.data?.success) {
        setIsFollowing((prevState) => !prevState);
        dispatch(setAuthUser(res.data.user));
        dispatch(setUserProfile(res.data.followingUser));
        toast.success(res.data.message);
      } else {
        toast.info(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between my-2 p-2 rounded-md hover:bg-base-200">
      {/* User Info Section */}
      <div className="flex items-center flex-1 min-w-0">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="size-10 bg-secondary">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
  
        <div className="flex flex-col ml-3 min-w-0">
          <Link to={`/profile/${user?._id}`} className="font-bold text-sm md:text-base truncate">
            {user?.username}
          </Link>
          <span className="font-normal text-sm text-gray-500 truncate">
            {user?.fullname}
          </span>
        </div>
      </div>
  
      {/* Follow Button */}
      <FollowButton
        isFollowing={isFollowing}
        isFollowedByUser={isFollowedByUser}
        isLoading={isLoading}
        handleFollowAndUnfollow={handleFollowAndUnfollow}
      />
    </div>
  );
  
};

export default UserInfoWithButton;
