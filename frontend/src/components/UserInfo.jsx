import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex sm:flex-col items-center justify-between p-3 hover:bg-base-200 rounded-md">
  {/* User Info */}
  <div className="flex sm:flex-col items-center gap-2 w-full">
    <Link to={`/profile/${user?._id}`}>
      <Avatar className="size-10 sm:size-14">
        <AvatarImage src={user?.profilePic} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Link>

    <div className="flex sm:flex-col items-center sm:text-center gap-3 w-full">
      <p className="ml-3 font-bold text-sm md:text-base text-base-content truncate sm:w-full sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
        <span className="font-normal text-sm sm:block sm:truncate">{user?.fullname}</span>
      </p>
    </div>
  </div>

  {/* Admin Button */}
  {user?.isAdmin && (
    <Link to="/admin">
      <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/80 transition-all sm:w-full">
        Admin Panel
      </button>
    </Link>
  )}
</div>
  );
};

export default UserInfo;
