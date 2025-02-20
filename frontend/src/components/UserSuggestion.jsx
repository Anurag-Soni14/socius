import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import UserInfo from "./UserInfo";

function UserSuggestion() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit h-screen my-10 bg-base-100 text-base-content">
      <UserInfo />
      <SuggestedUsers />
    </div>
  );
}

export default UserSuggestion;
