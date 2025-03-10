import React from "react";
import { useSelector } from "react-redux";
import Postframe from "@/components/Postframe";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const SavedPostsPage = () => {
    const {user} = useSelector((store) => store.auth);
    useGetUserProfile(user._id);
    const {userProfile} = useSelector((store) => store.auth);
  // Filter posts where the user has commented
  const SavedPosts = userProfile?.saved;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Commented Posts</h1>
      {SavedPosts.length > 0 ? (
        SavedPosts.map((post) => <Postframe key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">You haven’t saved any posts yet.</p>
      )}
    </div>
  );
};

export default SavedPostsPage;
