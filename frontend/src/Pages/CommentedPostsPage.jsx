import React from "react";
import { useSelector } from "react-redux";
import Postframe from "@/components/Postframe";
import useGetAllPost from "@/hooks/useGetAllPost";

const CommentedPostsPage = () => {
  useGetAllPost(); // Fetch all posts on mount
  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);

  // Filter posts where the user has commented
  const commentedPosts = posts.filter((post) => {
    return post.comments.map((comment) => comment.author._id === user?._id).includes(true);
    // return comments.includes(user?._id);
  })
  console.log(commentedPosts);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Commented Posts</h1>
      {commentedPosts.length > 0 ? (
        commentedPosts.map((post) => <Postframe key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">You haven’t commented on any posts yet.</p>
      )}
    </div>
  );
};

export default CommentedPostsPage;
