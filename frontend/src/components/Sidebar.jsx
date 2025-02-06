import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "@/Pages/CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  clearLikeNotifications,
  clearMessageNotifications,
} from "@/redux/rtnSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification, messageNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const [openDialogForCreate, setOpenDialogForCreate] = useState(false);

  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  const [isMessagePopoverOpen, setIsMessagePopoverOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (menu) => {
    if (menu === "Logout") {
      logoutHandler();
    } else if (menu === "Create") {
      setOpenDialogForCreate(true);
    } else if (menu === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (menu === "Home") {
      navigate("/");
    } else if (menu === "Messages") {
      navigate("/message");
      dispatch(clearMessageNotifications()); // Clear message notifications when clicked
    } else if (menu === "Notification") {
      navigate("/notification");
      dispatch(clearLikeNotifications()); // Clear like notifications when clicked
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="size-6">
          <AvatarImage src={user?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 z-10 w-[16%] h-screen border-r border-base-300 bg-base-100 text-base-content px-4">
      <div className="flex flex-col h-full">
        <h1 className="my-8 pl-3 font-bold text-xl text-base-content">Logo</h1>
        <div className="flex-grow">
          {sidebarItems.map((ListItem, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div
                  className="cursor-pointer flex items-center gap-3 relative hover:bg-base-200 rounded-lg p-3 my-3"
                  onClick={() => sidebarHandler(ListItem.text)}
                  onMouseEnter={() => {
                    if (ListItem.text === "Notification") {
                      setIsNotificationPopoverOpen(true);
                    } else if (ListItem.text === "Messages") {
                      setIsMessagePopoverOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (ListItem.text === "Notification") {
                      setIsNotificationPopoverOpen(false);
                    } else if (ListItem.text === "Messages") {
                      setIsMessagePopoverOpen(false);
                    }
                  }}
                >
                  <span className={`text-base-content hover:text-primary`}>
                    {ListItem.icon}
                  </span>
                  <span className="text-base-content">{ListItem.text}</span>

                  {/* Like/Dislike Notification Badge */}
                  {ListItem.text === "Notification" &&
                    likeNotification?.length > 0 && (
                      <Button
                        size="icon"
                        className="rounded-full size-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600"
                      >
                        {likeNotification?.length}
                      </Button>
                    )}

                  {/* Message Notification Badge */}
                  {ListItem.text === "Messages" &&
                    messageNotification?.length > 0 && (
                      <Button
                        size="icon"
                        className="rounded-full size-5 absolute bottom-6 left-6 bg-blue-600 hover:bg-blue-600"
                      >
                        {messageNotification?.length}
                      </Button>
                    )}
                </div>
              </PopoverTrigger>

              {(ListItem.text === "Notification" && isNotificationPopoverOpen) || 
              (ListItem.text === "Messages" && isMessagePopoverOpen) ? (
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    {/* Display Like/Dislike Notifications on Hover */}
                    {ListItem.text === "Notification" &&
                      (likeNotification?.length > 0 ? (
                        likeNotification.map((notification) => (
                          <div
                            key={notification?.userId}
                            className="flex items-center gap-2"
                          >
                            <Avatar>
                              <AvatarImage
                                src={notification?.userDetails?.profilePic}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {notification?.userDetails?.username}
                              </span>{" "}
                              liked your post
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No new notifications</p>
                      ))}

                    {/* Display Message Notifications on Hover */}
                    {ListItem.text === "Messages" &&
                      (messageNotification?.length > 0 ? (
                        messageNotification.map((notification) => (
                          <div
                            key={notification?.userId}
                            className="flex items-center gap-2"
                          >
                            <Avatar>
                              <AvatarImage
                                src={notification?.userDetails?.profilePic}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {notification?.userDetails?.username}
                              </span>{" "}
                              sent you a message
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No new messages</p>
                      ))}
                  </div>
                </PopoverContent>
              ) : null}
            </Popover>
          ))}
        </div>
      </div>
      <CreatePost
        openDialogForCreate={openDialogForCreate}
        setOpenDialogForCreate={setOpenDialogForCreate}
      />
    </div>
  );
}

export default Sidebar;
