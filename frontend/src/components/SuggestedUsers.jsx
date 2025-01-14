import React from "react";
import UserInfoWithButton from "./UserInfoWithButton";
import { useSelector } from "react-redux";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span>See all</span>
      </div>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <UserInfoWithButton
            key={user?._id}
            profilePic={user?.profilePic}
            username={user?.username}
            fullname={user?.fullname}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No suggested users available.</p>
      )}
    </div>
  );
}

export default SuggestedUsers;
