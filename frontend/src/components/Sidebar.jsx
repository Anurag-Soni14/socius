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
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "@/Pages/CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [openDialogForCreate, setOpenDialogForCreate] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
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
    }else if(menu === "Create"){
      setOpenDialogForCreate(true);
    }else if(menu === "Profile"){
      navigate(`/profile/${user?._id}`)
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
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
        <div>
          {sidebarItems.map((ListItem, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer flex items-center gap-3 relative hover:bg-gray-100 rounded-lg p-3 my-3"
                onClick={() => sidebarHandler(ListItem.text)}
              >
                {ListItem.icon}
                <span>{ListItem.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost openDialogForCreate={openDialogForCreate} setOpenDialogForCreate={setOpenDialogForCreate} />
    </div>
  );
}

export default Sidebar;
