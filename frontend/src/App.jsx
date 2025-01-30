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
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply the theme globally to the <html> tag
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]); // Re-run when theme changes

  return (
    <div className="h-full min-h-screen">
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;
