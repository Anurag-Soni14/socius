import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
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

  const handleToggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

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
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      // toast.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const saveHander = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post?._id}/save`,
        { withCredentials: true }
      );
  
      if (res.data.success) {
        toast.success(res.data.message);
  
        // Update the user profile state after saving/unsaving
        dispatch(
          setUserProfile({
            ...userProfile,
            saved: isSaved
              ? userProfile.saved.filter((p) => p._id !== post._id) // Remove from saved
              : [...userProfile.saved, post], // Add to saved
          })
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const deletePostHandler = async (postId)=>{
    try {
      const res = await axios.delete(`http://localhost:5000/api/v1/post/delete/${postId}`,{withCredentials: true});

      if(res.data.success){
        toast(res.data.message);
        dispatch(setPosts(posts.filter((post) => post._id !== postId)));
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  

  return (
    <div className="max-w-md mx-auto my-4 border border-base-300 rounded-lg shadow-md bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="size-10">
            <AvatarImage src={post.author?.profilePic} />
            <AvatarFallback className="bg-primary text-primary-content">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex items-center gap-3">
            <p className="font-bold text-sm md:text-base text-base-content">
              {post.author?.username}
            </p>
            {user?._id === post?.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-base-content/80" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center bg-base-100">
            <VisuallyHidden>
              <DialogTitle>Buttons</DialogTitle>
              <DialogDescription>Post related buttons</DialogDescription>
            </VisuallyHidden>
            {post?.author?._id !== user?._id && (
              <Button variant="ghost" className="text-error font-bold">
                Unfollow
              </Button>
            )}

            <Button variant="ghost">Add to favorite</Button>
            
              <Button variant="ghost" onClick={saveHander}>
                {isSaved ? "Unsave" : "Save"}
              </Button>

            {user && post?.author?._id === user._id && (
              <Button
                variant="ghost"
                className="text-error"
                onClick={() => deletePostHandler(post._id)}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

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
            {showFullCaption ? "see less" : "see more"}
          </span>
        )}
      </div>

      <div className="mt-3">
        <img
          src={post.image}
          alt="post"
          className="w-full h-64 bg-base-200 rounded-lg"
        />
      </div>

      <div className="my-3 border-t border-base-300"></div>

      <div className="mt-3 text-sm text-base-content">
        <p>
          <span className="font-bold">{postLike}</span> likes |{" "}
          <span className="font-bold">{comments.length}</span> comments
        </p>
      </div>

      <div className="my-3 border-t border-base-300"></div>

      <div className="flex items-center justify-between px-2">
        <button
          className="text-base-content hover:text-red-600 flex items-center gap-1"
          onClick={postLikeOrDislike}
        >
          {liked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
          Like
        </button>
        <button
          className="text-base-content hover:text-primary flex items-center gap-1"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setShowCommentDialog(true);
          }}
        >
          <MessageCircle /> Comments
        </button>
        <button className="text-base-content hover:text-primary flex items-center gap-1">
          <Send /> Share
        </button>
      </div>

      <CommentDialog
        showCommentDialog={showCommentDialog}
        setShowCommentDialog={setShowCommentDialog}
      />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 outline-none border border-base-300 rounded-lg text-sm m-2 bg-base-100 text-base-content"
        />
        {text && (
          <span
            className="text-primary cursor-pointer"
            onClick={() => commentHandler(post._id)}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Postframe;
