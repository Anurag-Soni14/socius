import React from "react";
import UserInfoWithButton from "./UserInfoWithButton";
import { useSelector } from "react-redux";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector(store => store.auth);

  return (
    <div className="my-10 w-full sm:w-60 lg:w-72">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-base-content">Suggested for you</h1>
        <span className="text-primary hover:text-primary-focus cursor-pointer">See all</span>
      </div>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <UserInfoWithButton
            key={user?._id}
            user={user}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No suggested users available.</p>
      )}
    </div>
  );
}

export default SuggestedUsers;
