import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

const UserInfoWithButton = ({profilePic, username, fullname}) => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex items-center gap-16 justify-between my-2  p-2 rounded-md">
      <div className="flex items-center ">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="size-10">
            <AvatarImage src={profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center gap-3">
          <p className="ml-3 font-bold text-sm md:text-base flex flex-col">
            <Link to={`/profile/${user?._id}`}>{username}</Link>
            <span className="font-normal text-sm">{fullname}</span>
          </p>
        </div>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700">Follow</Button>
    </div>
  );
};

export default UserInfoWithButton;
