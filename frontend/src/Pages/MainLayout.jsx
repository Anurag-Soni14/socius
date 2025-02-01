import Sidebar from '@/components/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      <Sidebar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
