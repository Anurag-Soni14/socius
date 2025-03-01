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
// import { setCommentNotification, setFollowNotification, setLikeNotification, setMessageNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotificationPage from "./Pages/NotificationPage";
import { addNotification, setMessageNotification } from "./redux/rtnSlice";
import SearchPage from "./Pages/SearchPage";
import PersonalInfo from "./Pages/PersonalInfo";
import HelpPage from "./Pages/HelpPage";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import ReportPage from "./Pages/ReportPage";
import LikedPostsPage from "./Pages/LikedPostsPage";
import CommentedPostsPage from "./Pages/CommentedPostsPage";
import FollowersFollowingPage from "./Pages/FollowersFollowingPage";
import AdminLayout from "./Pages/AdminLayout ";
import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagement from "./Pages/UserManagement";
import PostManagement from "./Pages/PostManagement";
import ReportManagement from "./Pages/ReportManagement";
import AdminEditUser from "./Pages/AdminEditUser";

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
      { path: "/notifications", element: <NotificationPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/account/personal-info", element: <PersonalInfo /> },
      { path: "/account/help", element: <HelpPage /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/contact-us", element: <ContactUs /> },
      { path: "/account/report", element: <ReportPage /> },
      { path: "/account/liked-post", element: <LikedPostsPage /> },
      { path: "/account/commented-post", element: <CommentedPostsPage /> },
      { path: "/profile/:id/followers-following", element: <FollowersFollowingPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/admin",
    element: (
      <AdminProtectedRoutes>
        <AdminLayout />
      </AdminProtectedRoutes>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/users", element: <UserManagement /> },
      { path: "/admin/posts", element: <PostManagement /> },
      { path: "/admin/reports", element: <ReportManagement /> },
      // { path: "/admin/contact-us", element: <ContactUsManagement /> },
      {path: "/admin/user/:id/edit", element: <AdminEditUser/>}
    ],
  },
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
        if (notification.type === "like" || notification.type === "dislike" || notification.type === "follow" || notification.type === "comment") {
          dispatch(addNotification(notification)); // Store in newNotifications
        } else if (notification.type === "message") {
          dispatch(setMessageNotification(notification)); // Store separately
        }
      });
  
      return () => {
        socket.off("getOnlineUsers");
        socket.off("notification");
        socket.disconnect();
      };
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
