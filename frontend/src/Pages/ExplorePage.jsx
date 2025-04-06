import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllPost from '@/hooks/useGetAllPost';
import Posts from "../components/Posts"; // Reusing the same Posts component

const ExplorePage = () => {
    useGetAllPost(); // Fetch all posts, not just from followings

  return (
    <div className="flex bg-base-100 text-base-content w-full">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold px-6 pt-6 pb-2">Explore</h1>
        <p className="text-sm text-gray-500 px-6 pb-4">
          Discover trending posts from everyone
        </p>
        <Posts />
      </div>
    </div>
  );
};

export default ExplorePage;
