import Feed from '@/components/Feed'
import UserSuggestion from '@/components/UserSuggestion'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <UserSuggestion/>
    </div>
  )
}

export default Home
