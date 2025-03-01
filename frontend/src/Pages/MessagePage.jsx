import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Image, MessageSquare, Send, Users, X } from "lucide-react";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Messages from "@/components/Messages";
import { toast } from "sonner";
import axios from "axios";
import { setMessages, setOnlineUsers } from "@/redux/chatSlice";
import { useSocket } from "@/context/SocketContext"; // Assuming you have this context hook
import { formatMessageTime, readFileAsDataURL } from "@/lib/utils";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";
import { useNavigate } from "react-router-dom";

const MessagePage = () => {
  useGetAllMessages();
  useGetRTM();
  const navigate = useNavigate();
  const [textMessage, setTextMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState("");
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(false);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const socket = useSocket(); // Access socket from context

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessageHandler = async (receiverId) => {
    if (!receiverId || !textMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    const messageData = new FormData();
    messageData.append("textMessage", textMessage);
    if (imagePreview) messageData.append("image", file);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${receiverId}`,
        messageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  useEffect(() => {
    if(messageEndRef.current && messages.length > 0){
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  },[messages]);

  return (
    <div className="flex h-full ml-[16%]">
      <div className="h-screen bg-base-200 flex-grow">
        <div className="flex items-center justify-center w-full h-full">
          <div className="bg-base-100 rounded-lg shadow-cl w-full h-full flex">
            <div className="flex h-full w-full rounded-lg overflow-hidden">
              <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
                <div className="border-b border-base-300 w-full p-5">
                  <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">
                      Conversations
                    </span>
                  </div>
                  {/* TODO: Online filter toggle */}
                  <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox checkbox-sm"
                      />
                      <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                      ({onlineUsers.length - 1} online)
                    </span>
                  </div>
                </div>

                <div className="overflow-y-auto w-full py-3">
                  {suggestedUsers.map((suggestedUser) => (
                    <button
                      key={suggestedUser._id}
                      onClick={() => dispatch(setSelectedUser(suggestedUser))}
                      className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
                    >
                      <div className="relative mx-auto lg:mx-0">
                        <Avatar className="size-12">
                          <AvatarImage src={suggestedUser?.profilePic} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {onlineUsers.includes(suggestedUser._id) && (
                          <span
                            className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                          />
                        )}
                      </div>

                      {/* User info - only visible on larger screens */}
                      <div className="hidden lg:block text-left min-w-0">
                        <div className="font-medium truncate">
                          {suggestedUser.fullname}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {onlineUsers.includes(suggestedUser._id)
                            ? "Online"
                            : "Offline"}
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredUsers?.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">
                      No online users
                    </div>
                  )}
                </div>
              </aside>

              {!selectedUser ? (
                <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
                  <div className="max-w-md text-center space-y-6">
                    {/* Icon Display */}
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="relative">
                        <div
                          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
                     justify-center animate-bounce"
                        >
                          <MessageSquare className="w-8 h-8 text-primary " />
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
              ) : (
                <div className="flex-1 flex flex-col overflow-auto w-full">
                  <div className="p-2.5 border-b border-base-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${selectedUser._id}`)}>
                        {/* Avatar */}
                        <div className="avatar">
                          <Avatar className="size-10">
                            <AvatarImage src={selectedUser?.profilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>

                        {/* User info */}
                        <div>
                          <h3 className="font-medium">
                            {selectedUser.fullname}
                          </h3>
                          <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id)
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                      </div>

                      {/* Close button */}
                      <button onClick={() => dispatch(setSelectedUser(null))}>
                        <X />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`chat ${
                          message.senderId === user._id
                            ? "chat-end"
                            : "chat-start"
                        }`}
                        ref={messageEndRef}
                      >
                        <div className=" chat-image avatar">
                          <Avatar className="size-10 border">
                            <AvatarImage src={message.senderId === user._id ? user.profilePic : selectedUser.profilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="chat-header mb-1">
                          <time className="text-xs opacity-50 ml-1">
                            {formatMessageTime(message.createdAt)}
                          </time>
                        </div>
                        <div className={`chat-bubble flex flex-col ${message.senderId === user._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"} p-2 rounded-lg`}>
                          {message.image && (
                            <img
                              src={message.image}
                              alt="Attachment"
                              className="sm:max-w-[200px] rounded-md mb-2"
                            />
                          )}
                          {message?.message && <p>{message?.message}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 w-full">
                    {imagePreview && (
                      <div className="mb-3 flex items-center gap-2">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                            flex items-center justify-center"
                            type="button"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessageHandler(selectedUser?._id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                          placeholder="Type a message..."
                          value={textMessage}
                          onChange={(e) => setTextMessage(e.target.value)}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />

                        <button
                          type="button"
                          className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Image size={20} />
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-circle"
                        disabled={!textMessage.trim() && !imagePreview}
                      >
                        <Send size={22} />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
