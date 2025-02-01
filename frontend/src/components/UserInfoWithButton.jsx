import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const UserInfoWithButton = ({user}) => {
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
      <Button className="bg-primary text-base-100 hover:bg-primary-focus">Follow</Button>
    </div>
  );
};

export default UserInfoWithButton;
