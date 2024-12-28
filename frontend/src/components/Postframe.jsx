import React, { useState } from "react";

function Postframe() {
  const [showOptions, setShowOptions] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleToggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };
  return (
    <div className="max-w-md mx-auto my-4 border rounded-lg shadow-md p-4 bg-white sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <p className="ml-3 font-bold text-sm md:text-base">Username</p>
        </div>
        <div className="relative">
          <button onClick={handleToggleOptions} className="text-gray-500 hover:text-black">...</button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Follow</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Reply</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Message</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3">
        <p className="text-sm text-gray-700 md:text-base">
          {showFullCaption ? (
            <>
              Full caption or message displayed here. <span className="text-blue-500 cursor-pointer" onClick={handleToggleCaption}>see less</span>
            </>
          ) : (
            <>
              Caption | Some text here... <span className="text-blue-500 cursor-pointer" onClick={handleToggleCaption}>see more</span>
            </>
          )}
        </p>
      </div>

      {/* Image */}
      <div className="mt-3">
        <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Separator */}
      <div className="my-3 border-t"></div>

      {/* Footer */}
      <div className="mt-3 text-sm text-gray-700">
        <p><span className="font-bold">999</span> likes | <span className="font-bold">999</span> comments</p>
      </div>

      <div className="my-3 border-t"></div>

      <div className="flex items-center justify-around">
        <button className="text-gray-500 hover:text-red-500">♡ Like</button>
        <button className="text-gray-500 hover:text-blue-500">Comment</button>
        <button className="text-gray-500 hover:text-green-500">Share</button>
      </div>
    </div>
  );
}

export default Postframe;
