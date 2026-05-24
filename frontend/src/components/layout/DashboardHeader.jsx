import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Bell, Command, User as UserIcon } from 'lucide-react';
import { Badge } from '../ui';

const DashboardHeader = ({ role = 'Recruiter' }) => {
  const { user } = useSelector((state) => state.auth);
  const profilePath = role === 'Recruiter' ? '/recruiter/profile' : '/student/profile';
  
  // Dynamic user data
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User';
  const userEmail = user?.email || 'not-available';

  return (
    <header className="h-20 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search candidates, sessions, or reports..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-12 py-2.5 text-sm text-zinc-300 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-[10px] font-bold text-zinc-600">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Badge variant="zinc">{role}</Badge>
           <div className="w-px h-4 bg-zinc-800 mx-2" />
           <Link to="/notifications" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full border-2 border-zinc-950" />
           </Link>
        </div>

        <Link to={profilePath} className="flex items-center gap-3 pl-6 border-l border-zinc-900 group">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-violet-400 transition-colors capitalize">{userName}</p>
              <p className="text-[10px] text-zinc-500 font-medium mt-1 lowercase">{userEmail}</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-violet-500/30 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <UserIcon className="w-5 h-5 text-white" />
           </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
