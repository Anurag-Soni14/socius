import React from "react";

const UserSuggestionSkeleton = () => {
  return (
    <div className="hidden sm:block sm:w-60 lg:w-fit h-screen my-10 bg-base-100 text-base-content animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex sm:flex-col items-center justify-between p-3 rounded-md">
        <div className="flex sm:flex-col items-center gap-2 w-full">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-300 rounded-full"></div>
          <div className="flex sm:flex-col items-center sm:text-center gap-3 w-full">
            <div className="h-4 bg-gray-300 rounded w-24 sm:w-32"></div>
            <div className="h-3 bg-gray-300 rounded w-16 sm:w-24"></div>
          </div>
        </div>
        <div className="w-24 h-8 bg-gray-300 rounded sm:w-full"></div>
      </div>

      {/* Suggested Users Skeleton */}
      <div className="my-10 w-full sm:w-60 lg:w-72">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex sm:flex-col xl:flex-row items-center justify-between my-2 p-2 rounded-md w-full"
          >
            <div className="flex items-center sm:flex-col xl:flex-row xl:gap-2 sm:items-center flex-1 min-w-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col ml-3 min-w-0 sm:ml-0 sm:text-center xl:text-start w-full">
                <div className="h-4 bg-gray-300 rounded w-24 sm:w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-16 sm:w-24"></div>
              </div>
            </div>
            <div className="w-20 h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSuggestionSkeleton;
