import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function CommentDialog({ showCommentDialog, setShowCommentDialog }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.posts);
  const [comments, setComments] = useState([]);
  const commentEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost?.comments);
    }
  }, [selectedPost]);

  const commentHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const postCommentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showCommentDialog) {
      setTimeout(() => {
        const commentEnd = document.getElementById("comment-end");
        commentEnd?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100); // Small delay ensures React renders first
    }
  }, [comments.length, showCommentDialog]);

  return (
    <Dialog open={showCommentDialog}>
      <DialogContent
        onInteractOutside={() => setShowCommentDialog(false)}
        className="max-w-5xl p-0 flex flex-col bg-base-100 text-base-content"
      >
        <VisuallyHidden>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            User comments will be shown here
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-1">
          <div className="w-1/2">
            {selectedPost?.image ? (
              <img
                src={selectedPost?.image}
                alt="post"
                className="w-full h-full object-cover rounded-l-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <p>{selectedPost?.caption}</p>
              </div>
            )}
          </div>
          {/* <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div> */}
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="size-10">
                    <AvatarImage src={selectedPost?.author?.profilePic} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs text-base-content">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-base-content" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center bg-base-200 text-base-content">
                  <button className="cursor-pointer w-full text-error">
                    Unfollow
                  </button>
                  <button className="cursor-pointer w-full">
                    Add to favorite
                  </button>
                </DialogContent>
              </Dialog>
            </div>
            <hr className="border-base-300" />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comments.map((comment, index) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  isLast={index === comments.length - 1}
                />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  placeholder="Add a comment..."
                  onChange={commentHandler}
                  className="w-full p-2 outline-none border border-base-300 bg-base-200 text-base-content rounded-lg text-sm"
                />
                <Button
                  variant="outline"
                  onClick={postCommentHandler}
                  disabled={!text.trim()}
                  className="text-base-content border-base-300"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
