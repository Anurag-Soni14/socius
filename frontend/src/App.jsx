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
import { SocketProvider } from "./context/SocketContext.jsx";
import { setLikeNotification } from "./redux/realTimeNotificationSlice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && socket) {
      socket.connect(); // Ensure socket is connected if the user is logged in

      // Listen for events like online users
      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socket.off("getOnlineUsers"); // Clean up the event listener when component unmounts
        socket.disconnect(); // Disconnect the socket when the user logs out
      };
    }
  }, [user, socket, dispatch]); // Add socket to dependencies

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <SocketProvider>
      <div className="h-full min-h-screen">
        <RouterProvider router={browserRouter} />
      </div>
    </SocketProvider>
  );
};

export default App;
