import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser, setUserProfile } from "../redux/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserInfoWithButton = ({ user }) => {
  const dispatch = useDispatch();
  const userId = user?._id;
  const { user: authUser } = useSelector((store) => store.auth);

  // Local state for tracking follow status
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update `isFollowing` whenever `authUser.following` changes
  useEffect(() => {
    if (authUser?.following?.includes(userId)) {
      setIsFollowing(true); // User is following the current user
    } else {
      setIsFollowing(false); // User is not following the current user
    }
  }, [authUser, userId]);

  const handleFollowAndUnfollow = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res && res.data) {
        if (res.data.success) {
          // Toggle follow status and update Redux state
          setIsFollowing((prevState) => !prevState); // Toggle follow state
          dispatch(setAuthUser(res.data.user)); // Update the auth user state in Redux
          dispatch(setUserProfile(res.data.followingUser)); // Update the user profile in Redux
          toast.success(res.data.message); // Display success toast
        } else {
          toast.info(res.data.message); // Display info message if the response isn't success
        }
      } else {
        toast.error("Unexpected response structure"); // Handle case where response structure isn't as expected
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className="flex items-center gap-16 justify-between my-2 p-2 rounded-md hover:bg-base-200">
      <div className="flex items-center">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="size-10 bg-secondary">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center gap-3">
          <p className="ml-3 font-bold text-sm md:text-base flex flex-col text-base-content">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            <span className="font-normal text-sm">{user?.fullname}</span>
          </p>
        </div>
      </div>

      {/* Follow/Unfollow Button */}
      <Button onClick={handleFollowAndUnfollow} className="px-4 py-2">
        {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : ""}
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserInfoWithButton;
