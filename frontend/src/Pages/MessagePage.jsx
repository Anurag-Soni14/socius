import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Messages from "@/components/Messages";
import { toast } from "sonner";
import axios from "axios";
import { setMessages, setOnlineUsers } from "@/redux/chatSlice";
import { useSocket } from "@/context/SocketContext"; // Assuming you have this context hook

const MessagePage = () => {
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const socket = useSocket(); // Access socket from context

  const sendMessageHandler = async (receiverId) => {
    if (!receiverId || !textMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: {
          "Content-Type": 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for online users when socket is connected
      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers)); // Update Redux store with the latest online users
      });

      return () => {
        socket.off("getOnlineUsers"); // Clean up the event listener when the component unmounts
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null)); // Reset selected user when component unmounts
    };
  }, [dispatch]);

  return (
    <div className="flex ml-[16%] h-full">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-6 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="size-14">
                  <AvatarImage src={suggestedUser?.profilePic} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.fullname}</span>
                  <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePic} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.fullname}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Write a message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              <Send />
            </Button>
          </div>
        </section>
      ) : (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
          <div className="max-w-md text-center space-y-6">
            {/* Icon Display */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
                >
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-2xl font-bold">Welcome to Socius!</h2>
            <p className="text-base-content/60">
              Select a conversation from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
