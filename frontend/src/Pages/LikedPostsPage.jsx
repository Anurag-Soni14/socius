import React from "react";
import { useSelector } from "react-redux";
import Postframe from "@/components/Postframe";
import useGetAllPost from "@/hooks/useGetAllPost";

const LikedPostsPage = () => {
  useGetAllPost(); // Fetch all posts when the page loads

  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);

  // Filter posts liked by the current user
  const likedPosts = posts.filter((post) => post.likes.includes(user?._id));

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Liked Posts</h2>
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => <Postframe key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">You haven't liked any posts yet.</p>
      )}
    </div>
  );
};

export default LikedPostsPage;
