import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const FollowButton = ({ isFollowing, isFollowedByUser, isLoading, handleFollowAndUnfollow }) => {
  return (
    <Button onClick={handleFollowAndUnfollow} className="px-4 py-2 xl:w-[110px] sm:w-full text-center whitespace-nowrap flex items-center justify-center">
      {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : ""}
      {isFollowing ? "Unfollow" : isFollowedByUser ? "Follow Back" : "Follow"}
    </Button>
  );
};

export default FollowButton;
