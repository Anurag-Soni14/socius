import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SideBar from './components/SideBar'
import Postframe from './components/Postframe'
import SearchPage from './Pages/SearchPage'
import UserInfoWithButton from './components/UserInfoWithButton'
import UserInfo from './components/UserInfo'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import MainLayout from './Pages/MainLayout'
import Home from './Pages/Home'
import Profile from './Pages/Profile'


const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children: [
      {
        path: '/',
        element:<Home/>
      },
      {
        path: '/profile',
        element:<Profile/>
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  }

])

const App = () => {
  return (
    <>
      <RouterProvider  router={browserRouter} />
    </>
  )
}

export default App
