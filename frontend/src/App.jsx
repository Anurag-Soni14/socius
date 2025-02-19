import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useThemeStore } from "./hooks/useThemeStore";
import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import Setting from "./Pages/Setting";
import ChangeTheme from "./Pages/ChangeTheme";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import MessagePage from "./Pages/MessagePage";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/chatSlice";
import { useSocket } from "./context/SocketContext";
import { setCommentNotification, setFollowNotification, setLikeNotification, setMessageNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        {" "}
        <MainLayout />{" "}
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/settings", element: <Setting /> },
      { path: "/account/settings/edit-profile", element: <EditProfile /> },
      { path: "/account/settings/change-theme", element: <ChangeTheme /> },
      { path: "/message", element: <MessagePage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

const App = () => {
  const { theme } = useThemeStore();
  const { user } = useSelector((store) => store.auth);
  const socket = useSocket(); // ✅ Now socket will not be null
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && socket) {
      socket.connect();
  
      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
  
      socket.on("notification", (notification) => {
        if (notification.type === "like" || notification.type === "dislike") {
          dispatch(setLikeNotification(notification));
        } else if (notification.type === "message") {
          console.log(notification);
          dispatch(setMessageNotification(notification));
        } else if (notification.type === "follow") {
          console.log(notification);
          dispatch(setFollowNotification(notification));
        } else if (notification.type === "comment") {
          console.log(notification);
          dispatch(setCommentNotification(notification));
        }
      });
  
      return () => {
        socket.off("getOnlineUsers");
        socket.off("notification");
        socket.disconnect();
      };
    } else {
      console.log("⚠️ Socket is NOT connected in App.jsx.");
    }
  }, [user, socket, dispatch]);
  
  

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="h-full min-h-screen">
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;
