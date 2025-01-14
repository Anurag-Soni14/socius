import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
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

function Postframe({ post }) {
  const captionRef = useRef(null);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [text, setText] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);

  useEffect(() => {
    if (captionRef.current) {
      const { scrollWidth, clientWidth } = captionRef.current;
      setIsTruncated(scrollWidth > clientWidth);
    }
  }, [post.caption]);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleToggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

  const inputCommentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async (e) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const postLikeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        //  update post
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
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
      console.error(error);
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

      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 border rounded-lg shadow-md p-4 bg-white sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="size-10">
            <AvatarImage src={post.author?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <p className="ml-3 font-bold text-sm md:text-base">
              {post.author?.username}
            </p>
            {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>
        <div className="relative">
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            
            <DialogContent className="flex flex-col items-center text-sm text-center">
              <VisuallyHidden>
                <DialogTitle>Buttons</DialogTitle>
                <DialogDescription>post related buttons</DialogDescription>
              </VisuallyHidden>
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ed4956] font-bold"
              >
                Unfollow
              </Button>
              <Button variant="ghost" className="cursor-pointer w-fit">
                Add to favorite
              </Button>
              <Button variant="ghost" className="cursor-pointer w-fit">
                Bookmark
              </Button>
              {user && post?.author?._id === user._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit "
                  onClick={deletePostHandler}
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3">
        <p
          ref={captionRef}
          className={`text-sm text-gray-700 md:text-base ${
            !showFullCaption && isTruncated ? "truncate" : ""
          }`}
          style={
            !showFullCaption
              ? {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }
              : {}
          }
        >
          {post.caption}
        </p>
        {isTruncated && !showFullCaption && (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleToggleCaption}
          >
            see more
          </span>
        )}
        {showFullCaption && (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleToggleCaption}
          >
            see less
          </span>
        )}
      </div>

      {/* Image */}
      <div className="mt-3">
        <img
          src={post.image}
          alt="post"
          className="w-full h-64 bg-gray-300 rounded-lg"
        />
      </div>

      {/* Separator */}
      <div className="my-3 border-t"></div>

      {/* Footer */}
      <div className="mt-3 text-sm text-gray-700">
        <p>
          <span className="cursor-pointer">
            <span className="font-bold">{postLike}</span> likes |{" "}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setShowCommentDialog(true);
            }}
          >
            <span className="font-bold">{comments.length}</span> comments
          </span>
        </p>
      </div>

      <div className="my-3 border-t"></div>

      <div className="flex items-center justify-between px-2">
        <button
          className="text-gray-500 hover:text-red-500 flex items-center justify-between gap-1"
          onClick={postLikeOrDislike}
        >
          {liked ? (
            <FaHeart className="size-[22px] text-red-600 cursor-pointer" />
          ) : (
            <FaRegHeart className="size-[22px] cursor-pointer" />
          )}
          Like
        </button>
        <button
          className="text-gray-500 hover:text-gray-600 flex items-center gap-1"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setShowCommentDialog(true);
          }}
        >
          <MessageCircle /> Comments
        </button>
        <button className="text-gray-500 hover:text-gray-600 flex items-center gap-1">
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
          onChange={inputCommentHandler}
          placeholder="Write a comment..."
          className="w-full p-2 outline-none border border-gray-300 rounded-lg text-sm m-2"
        />
        {text && (
          <span
            className="text-[#38adf8] text-sm cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Postframe;
