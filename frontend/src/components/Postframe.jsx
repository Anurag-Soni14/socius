import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { setUserProfile } from "@/redux/authSlice";

function Postframe({ post }) {
  const captionRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  useGetUserProfile(user?._id);
  const { userProfile } = useSelector((store) => store.auth);

  const [showFullCaption, setShowFullCaption] = useState(false);
  const [text, setText] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const isSaved = userProfile?.saved?.some(
    (savedPost) => savedPost?._id === post?._id
  );

  useEffect(() => {
    if (captionRef.current) {
      const { scrollWidth, clientWidth } = captionRef.current;
      setIsTruncated(scrollWidth > clientWidth);
    }
  }, [post.caption]);

  const handleToggleCaption = () => setShowFullCaption(!showFullCaption);

  const postLikeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setPostLike(liked ? postLike - 1 : postLike + 1);
        setLiked(!liked);
        dispatch(
          setPosts(
            posts.map((p) =>
              p._id === post._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            )
          )
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 border border-base-300 rounded-xl shadow-lg bg-base-100 p-5">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={post.author?.profilePic} />
            <AvatarFallback className="bg-primary text-primary-content">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base-content">
              {post.author?.username}
            </p>
            {user?._id === post?.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-base-content/70 hover:text-primary" />
          </DialogTrigger>
          <DialogContent className="text-sm text-center bg-base-100 flex flex-col items-center space-y-2">
            <VisuallyHidden>
              <DialogTitle>Buttons</DialogTitle>
              <DialogDescription>Post related buttons</DialogDescription>
            </VisuallyHidden>
            <Button variant="ghost" className="text-error font-bold">
              Unfollow
            </Button>
            <Button variant="ghost" onClick={() => console.log("Saved")}>
              {isSaved ? "Unsave" : "Save"}
            </Button>
            {user && post?.author?._id === user._id && (
              <Button variant="ghost" className="text-error">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Caption */}
      <div className="mt-3">
        <p
          ref={captionRef}
          className={`text-sm text-base-content ${
            !showFullCaption && isTruncated ? "truncate" : ""
          }`}
        >
          {post.caption}
        </p>
        {isTruncated && (
          <span
            className="text-primary cursor-pointer"
            onClick={handleToggleCaption}
          >
            {showFullCaption ? "See less" : "See more"}
          </span>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mt-3 rounded-xl overflow-hidden shadow-sm">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-72 object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center mt-4 text-base-content">
        <button
          className="flex items-center gap-2 hover:text-red-600"
          onClick={postLikeOrDislike}
        >
          {liked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}{" "}
          {postLike}
        </button>
        <button
          className="flex items-center gap-2 hover:text-primary"
          onClick={() => setShowCommentDialog(true)}
        >
          <MessageCircle /> {comments.length}
        </button>
        <button className="flex items-center gap-2 hover:text-primary">
          <Send />
        </button>
        <button
          className="flex items-center gap-2 hover:text-primary"
          onClick={() => console.log("Saved")}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      <CommentDialog
        showCommentDialog={showCommentDialog}
        setShowCommentDialog={setShowCommentDialog}
      />
    </div>
  );
}

export default Postframe;
