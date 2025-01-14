import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import UserInfo from "./UserInfo";

function UserSuggestion() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit h-screen my-10 pr-4">
      {/* <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="size-10">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center gap-3">
          <p className="ml-3 font-bold text-sm md:text-base flex flex-col">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            <span className="font-normal text-sm">{user?.fullname}</span>
          </p>
        </div>
      </div> */}
      <UserInfo/>

      <SuggestedUsers />
    </div>
  );
}

export default UserSuggestion;
