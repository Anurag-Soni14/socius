import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";

function Messages({ selectedUser }) {
  useGetAllMessages();
  useGetRTM();
  const { user } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.fullname}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages?.map((msg) => {
            return (
              <div
                className={`flex ${
                  msg?.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
                key={msg?._id}
              >
                <div className={`p-2 rounded-lg max-w-xs break-words ${msg?.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>{msg?.message}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Messages;
