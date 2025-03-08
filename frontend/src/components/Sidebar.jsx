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
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
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
    setIsOpen(false);
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
    <aside
      className={`bg-base-100 fixed top-0 left-0 z-20 h-screen w-60 transition-transform transform sm:sticky ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:w-16 xl:w-60 p-4 sm:p-2 border-r border-base-300`}
    >
      {/* Button to toggle sidebar on small screens */}
      {!isOpen && (
        <button
          className="sm:hidden absolute top-2 left-64 text-white text-3xl"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {/* Close button */}
      <button
        className="sm:hidden absolute top-4 right-4 text-white text-2xl"
        onClick={toggleSidebar}
      >
        X
      </button>

      {/* Sidebar Content */}
      <h1 className="text-white text-2xl font-bold mb-6 sm:text-sm xl:text-2xl">
        Logo
      </h1>

      {/* Sidebar Items */}
      <div className="flex flex-col h-full">
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
                  className="w-full size-12 cursor-pointer flex items-center gap-3 px-3 relative hover:bg-base-200 rounded-lg xl:p-3 my-3 xl:mx-2 sm:mx-1 sm:p-2"
                  onClick={() => sidebarHandler(ListItem.text)}
                  onMouseEnter={() => {
                    if (ListItem.text === "Notification")
                      setIsNotificationPopoverOpen(true);
                    if (ListItem.text === "Messages")
                      setIsMessagePopoverOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (ListItem.text === "Notification")
                      setIsNotificationPopoverOpen(false);
                    if (ListItem.text === "Messages")
                      setIsMessagePopoverOpen(false);
                  }}
                >
                  <span className="text-white hover:text-primary">
                    {ListItem.icon}
                  </span>
                  <span className="text-white ml-4 sm:hidden xl:block">
                    {ListItem.text}
                  </span>

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
                            <AvatarImage
                              src={notification?.userDetails?.profilePic}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification?.userDetails?.username}
                            </span>{" "}
                            {notification?.message}
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
                            <span className="font-bold">
                              {msg?.userDetails?.username}
                            </span>{" "}
                            {msg?.message}
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

      {/* Create Post Dialog */}
      <CreatePost
        openDialogForCreate={openDialogForCreate}
        setOpenDialogForCreate={setOpenDialogForCreate}
      />
    </aside>
  );
}

export default Sidebar;
