import React from "react";
import SuggestedUsers from "./SuggestedUsers";
import UserInfo from "./UserInfo";
import { useSelector } from "react-redux";
import UserSuggestionSkeleton from "@/skeletons/UserSuggestionSkeleton";

function UserSuggestion() {
  const {user, suggestedUsers} = useSelector(store => store.auth);

  if (!user || !suggestedUsers) return <UserSuggestionSkeleton/>;
  return (
    <div className="hidden sm:block sm:w-60 lg:w-fit h-screen my-10 bg-base-100 text-base-content">
      <UserInfo />
      <SuggestedUsers />
    </div>
  );
}

export default UserSuggestion;
