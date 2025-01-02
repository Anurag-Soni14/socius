import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

function Postframe() {
  const [showOptions, setShowOptions] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [text, setText] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleToggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };
  const commentHandler = (e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }
  return (
    <div className="max-w-md mx-auto my-4 border rounded-lg shadow-md p-4 bg-white sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* <div className="w-10 h-10 bg-gray-300 rounded-full"></div> */}
          <Avatar className="size-10 ">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="ml-3 font-bold text-sm md:text-base">Username</p>
        </div>
        <div className="relative">
          {/* <button
            onClick={handleToggleOptions}
            className="text-gray-500 hover:text-black"
          >
            ...
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Follow
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Reply
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Message
                </li>
              </ul>
            </div>
          )} */}

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
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
              <Button variant="ghost" className="cursor-pointer w-fit ">
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3">
        <p className="text-sm text-gray-700 md:text-base">
          {showFullCaption ? (
            <>
              Full caption or message displayed here.{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleToggleCaption}
              >
                see less
              </span>
            </>
          ) : (
            <>
              Caption | Some text here...{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleToggleCaption}
              >
                see more
              </span>
            </>
          )}
        </p>
      </div>

      {/* Image */}
      <div className="mt-3">
        {/* <div className="w-full h-64 bg-gray-300 rounded-lg"></div> */}
        {/* <img src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg" alt="post" className="w-full h-64 bg-gray-300 rounded-lg"/> */}
        <img
          src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
          alt="post"
          className="w-full h-64 bg-gray-300 rounded-lg"
        />
      </div>

      {/* Separator */}
      <div className="my-3 border-t"></div>

      {/* Footer */}
      <div className="mt-3 text-sm text-gray-700">
        <p>
          <span className="font-bold">999</span> likes |{" "}
          <span className="font-bold">999</span> comments
        </p>
      </div>

      <div className="my-3 border-t"></div>

      <div className="flex items-center justify-between px-2">
        <button className="text-gray-500 hover:text-red-500 flex items-center justify-between">
        <FaRegHeart className="size-[22px]"/> Like
        </button>
        <button className="text-gray-500 hover:text-gray-600 flex items-center" onClick={()=>setShowCommentDialog(true)}>
          <MessageCircle/> Comments
          </button>
        <button className="text-gray-500 hover:text-gray-600 flex items-center">
          <Send/> Share
          </button>
      </div>
      <CommentDialog showCommentDialog={showCommentDialog} setShowCommentDialog={setShowCommentDialog} />
      <div className="flex  items-center justify-between">
        <input 
          type="text" 
          value={text}
          onChange={commentHandler}
          placeholder="Write a comment..."
          className="w-full p-2 outline-none border border-gray-300 rounded-lg text-sm m-2"
        />
        {
          text && <span className="text-[#38adf8] text-sm">Post</span>
        }
        
      </div>
    </div>
  );
}

export default Postframe;
