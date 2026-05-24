import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen bg-background text-zinc-100 flex">
      <Sidebar role="Recruiter" />
      <div className="flex-1 ml-72 flex flex-col">
        <DashboardHeader role="Recruiter" />
        <main className="p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
