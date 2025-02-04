import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex items-center gap-2 p-3 hover:bg-base-200 rounded-md">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="size-10">
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
  );
};

export default UserInfo;
