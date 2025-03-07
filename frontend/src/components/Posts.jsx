import React from "react";
import Postframe from "./Postframe";
import { useSelector } from "react-redux";
import HomePageSkeleton from "@/skeletons/HomePageSkeleton";

function Posts() {
  const { posts } = useSelector((store) => store.posts);
  if(!posts) return <HomePageSkeleton />;
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mx-4">
      {posts.map((post) => (
        <div key={post._id} className="mb-4 break-inside-avoid">
          <Postframe key={post._id} post={post} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
