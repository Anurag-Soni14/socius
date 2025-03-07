import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto bg-base-100 shadow-lg rounded-lg overflow-hidden h-full mt-1 animate-pulse">
      {/* Cover Photo Skeleton */}
      <div className="relative h-52 bg-base-300"></div>

      {/* Profile Info Section */}
      <div className="px-6 py-4 relative">
        {/* Profile Picture Skeleton */}
        <div className="absolute -top-12 left-6">
          <div className="size-24 bg-base-300 rounded-full border-4 border-white shadow-lg"></div>
        </div>

        {/* User Details Skeleton */}
        <div className="mt-8 sm:mt-0 pl-28 sm:pl-32">
          <div className="h-6 w-32 bg-base-300 rounded"></div>
          <div className="h-4 w-24 bg-base-300 rounded mt-2"></div>
          <div className="h-4 w-full bg-base-300 rounded mt-2"></div>
          <div className="h-4 w-40 bg-base-300 rounded mt-2"></div>
        </div>

        {/* Followers & Following Stats Skeleton */}
        <div className="flex gap-8 mt-6">
          <div className="h-4 w-20 bg-base-300 rounded"></div>
          <div className="h-4 w-20 bg-base-300 rounded"></div>
        </div>

        {/* Interests Skeleton */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="h-6 w-12 bg-base-300 rounded-full"></div>
          <div className="h-6 w-16 bg-base-300 rounded-full"></div>
          <div className="h-6 w-10 bg-base-300 rounded-full"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-start gap-6 border-b mt-4 px-6">
        <div className="h-6 w-16 bg-base-300 rounded"></div>
        <div className="h-6 w-16 bg-base-300 rounded"></div>
      </div>

      {/* Posts / Saved Content Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 px-6 pb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-40 bg-base-300 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
