import React from 'react';
import user_image from '../assets/user_image.jpeg';

const UserInfo = () => {
  return (
    <div className="flex items-center gap-4 border border-gray-300 rounded-lg shadow-md sm:w-fit w-full p-4 bg-white">
      <img
        src={user_image}
        className="w-16 h-16 border border-gray-300 rounded-full object-cover"
        alt="user"
      />
      <div className="flex flex-col justify-center">
        <h1 className="text-sm font-semibold text-gray-800">_drashan_123</h1>
        <h2 className="text-xs text-gray-600">Darshan Dhameliya</h2>
      </div>
    </div>
  );
};

export default UserInfo;
