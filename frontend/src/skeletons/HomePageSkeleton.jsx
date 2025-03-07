import React from "react";

const HomePageSkeleton = () => {
  return (
    <div className="w-full p-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {[...Array(8)].map((_, index) => {
        const imageHeight = 200 + (index % 3) * 80; // Adjusted for better height handling
        return (
          <div
            key={index}
            className="bg-base-100 p-4 rounded-lg shadow-md animate-pulse relative overflow-hidden"
            style={{ minHeight: `${imageHeight + 100}px` }} // Ensuring enough space for all sections
          >
            {/* Shining effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent animate-shimmer"></div>

            {/* Header */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-base-300 rounded-full"></div>
              <div className="flex flex-col w-full">
                <div className="w-2/3 h-4 bg-base-300 rounded"></div>
                <div className="w-1/3 h-3 bg-base-300 rounded mt-1"></div>
              </div>
            </div>

            {/* Caption */}
            <div className="w-full h-4 bg-base-300 rounded mt-3 relative z-10"></div>
            <div className="w-4/5 h-4 bg-base-300 rounded mt-2 relative z-10"></div>

            {/* Image Placeholder with Dynamic Height */}
            <div
              className="w-full bg-base-300 rounded-lg mt-3 relative z-10"
              style={{ height: `${imageHeight}px` }}
            ></div>

            {/* Action Icons */}
            <div className="flex justify-between items-center mt-4 relative z-10">
              <div className="w-6 h-6 bg-base-300 rounded-full"></div>
              <div className="w-6 h-6 bg-base-300 rounded-full"></div>
              <div className="w-6 h-6 bg-base-300 rounded-full"></div>
              <div className="w-6 h-6 bg-base-300 rounded-full"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePageSkeleton;