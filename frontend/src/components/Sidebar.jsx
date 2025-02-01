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

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [openDialogForCreate, setOpenDialogForCreate] = useState(false);

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
            <div
              key={index}
              className="cursor-pointer flex items-center gap-3 relative hover:bg-base-200 rounded-lg p-3 my-3"
              onClick={() => sidebarHandler(ListItem.text)}
            >
              <span className={`text-base-content hover:text-primary`}>
                {ListItem.icon}
              </span>
              <span className="text-base-content">{ListItem.text}</span>
              {ListItem.text === "Notification" &&
                likeNotification?.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" className="rounded-full size-5 absolute bottom-6 left-6">{likeNotification?.length}</Button>

                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {
                          likeNotification?.length === 0 ? (<p>No new Notification</p>) : (
                            likeNotification.map((notification)=>{
                              return (
                                <div key={notification?.userId}>
                                  <Avatar>
                                    <AvatarImage src={notification?.userDetails?.profilePic} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm"><span className="font-bold">{notification?.userDetails?.username} </span> liked your post</p>
                                </div>
                              )
                            })  
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
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
