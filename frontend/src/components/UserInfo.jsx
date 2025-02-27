import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex items-center justify-between p-3 hover:bg-base-200 rounded-md">
      {/* User Info */}
      <div className="flex items-center gap-2">
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

      {/* Admin Button (Only visible for admins) */}
      {user?.isAdmin && (
        <Link to="/admin">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/80 transition-all">
            Admin Panel
          </button>
        </Link>
      )}
    </div>
  );
};

export default UserInfo;
