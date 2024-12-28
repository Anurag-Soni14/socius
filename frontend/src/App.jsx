import React from 'react'
<<<<<<< HEAD
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
=======
import SideBar from './Componets/SideBar'
import Componets2 from './Componets/Componets2'
import Componets1 from './Componets/Compotnes1'
>>>>>>> 44b563b1a7616a25ebf050712aef3c21a2cf448d


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
<<<<<<< HEAD
    <>
      <RouterProvider  router={browserRouter} />
    </>
=======
    <div>
      <SideBar/>
      {/* <Componets2/>
      <Componets1/> */}
    </div>
>>>>>>> 44b563b1a7616a25ebf050712aef3c21a2cf448d
  )
}

export default App
