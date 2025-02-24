import React from "react";
import Postframe from "./Postframe";
import { useSelector } from "react-redux";

function Posts() {
  const { posts } = useSelector((store) => store.posts);
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
