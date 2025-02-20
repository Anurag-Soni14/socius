import Feed from '@/components/Feed';
import UserSuggestion from '@/components/UserSuggestion';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import React from 'react';
import { Outlet } from 'react-router-dom';

function Home() {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex bg-base-100 text-base-content w-full">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <UserSuggestion />
    </div>
  );
}

export default Home;
