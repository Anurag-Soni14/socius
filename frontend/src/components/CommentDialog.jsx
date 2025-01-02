import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

function CommentDialog({ showCommentDialog, setShowCommentDialog }) {
  const [text, setText] = useState("");

  const commentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const postCommentHandler = async (e)=>{
    alert(text)
  }
  return (
    <Dialog open={showCommentDialog}>
      <DialogContent
        onInteractOutside={() => setShowCommentDialog(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
              alt="post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="size-10 ">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">Username</Link>
                  {/* <span className="text-gray-600 text-sm ">Bio here...</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild className="cursor-pointer">
                  <MoreHorizontal />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <button className="cursor-pointer w-full text-[#ed4956]">
                    Unfollow
                  </button>
                  <button className="cursor-pointer w-full">
                    Add to favorite
                  </button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments here...
            </div>
            <div className="p-4 ">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onChange={commentHandler}
                  className="w-full p-2 outline-none border border-gray-300 rounded-lg"
                />
                <Button variant="outline" onClick={postCommentHandler} disabled={!text.trim()}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
