import Sidebar from '@/components/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen grid grid-rows-1 xl:grid-cols-[240px_1fr] sm:grid-cols-[64px_1fr]">
      <Sidebar />
      <div className="">
        <Outlet />
      </div>  
    </div>
  );
}

export default MainLayout;
