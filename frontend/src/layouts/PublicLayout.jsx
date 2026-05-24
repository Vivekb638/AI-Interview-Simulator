import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-400">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
