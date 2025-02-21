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
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";
import CreatePost from "@/Pages/CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  clearLikeNotifications,
  clearMessageNotifications,
  markNotificationsAsSeen,
} from "@/redux/rtnSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { newNotifications, messageNotification } = useSelector(
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
        dispatch(setSuggestedUsers(null));
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
      dispatch(clearMessageNotifications()); // Clear message notifications on click
    } else if (menu === "Notification") {
      navigate("/notifications");
      dispatch(markNotificationsAsSeen()); // Clear unseen notifications
    } else if (menu === "Search") {
      navigate("/search");
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
    <div className="fixed top-0 left-0 z-10 w-[14%] h-screen border-r border-base-300 bg-base-100 text-base-content pl-4">
      <div className="flex flex-col h-full">
        <h1 className="my-8 pl-3 font-bold text-xl text-base-content">Logo</h1>
        <div className="flex-grow">
          {sidebarItems.map((ListItem, index) => (
            <Popover
              key={index}
              open={
                ListItem.text === "Notification"
                  ? isNotificationPopoverOpen
                  : ListItem.text === "Messages"
                  ? isMessagePopoverOpen
                  : undefined
              }
              onOpenChange={
                ListItem.text === "Notification"
                  ? setIsNotificationPopoverOpen
                  : ListItem.text === "Messages"
                  ? setIsMessagePopoverOpen
                  : undefined
              }
            >
              <PopoverTrigger asChild>
                <div
                  className="cursor-pointer flex items-center gap-3 relative hover:bg-base-200 rounded-lg p-3 my-3"
                  onClick={() => sidebarHandler(ListItem.text)}
                  onMouseEnter={() => {
                    if (ListItem.text === "Notification") setIsNotificationPopoverOpen(true);
                    if (ListItem.text === "Messages") setIsMessagePopoverOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (ListItem.text === "Notification") setIsNotificationPopoverOpen(false);
                    if (ListItem.text === "Messages") setIsMessagePopoverOpen(false);
                  }}
                >
                  <span className="text-base-content hover:text-primary">
                    {ListItem.icon}
                  </span>
                  <span className="text-base-content">{ListItem.text}</span>

                  {/* Notification Badge */}
                  {(ListItem.text === "Notification" && newNotifications?.length > 0) ||
                  (ListItem.text === "Messages" && messageNotification?.length > 0) ? (
                    <Button
                      size="icon"
                      className="rounded-full size-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600"
                    >
                      {ListItem.text === "Notification"
                        ? newNotifications?.length
                        : messageNotification?.length}
                    </Button>
                  ) : null}
                </div>
              </PopoverTrigger>

              {/* Notification Popup */}
              {ListItem.text === "Notification" && (
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    {newNotifications?.length > 0 ? (
                      newNotifications.map((notification, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={notification?.userDetails?.profilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">{notification?.userDetails?.username}</span> {notification?.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                </PopoverContent>
              )}

              {/* Messages Popup */}
              {ListItem.text === "Messages" && (
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    {messageNotification?.length > 0 ? (
                      messageNotification.map((msg, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={msg?.userDetails?.profilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">{msg?.userDetails?.username}</span> {msg?.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No new messages</p>
                    )}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </div>
      </div>
      <CreatePost openDialogForCreate={openDialogForCreate} setOpenDialogForCreate={setOpenDialogForCreate}/>
    </div>
  );
}

export default Sidebar;
