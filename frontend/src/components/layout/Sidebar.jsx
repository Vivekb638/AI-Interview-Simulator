import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Settings, 
  HelpCircle,
  LogOut,
  Zap
} from 'lucide-react';

const Sidebar = ({ role = 'Recruiter' }) => {
  const recruiterLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
    { name: 'Candidates', icon: Users, path: '/recruiter/candidates' },
    { name: 'Live Monitoring', icon: ShieldCheck, path: '/recruiter/live-monitoring' },
    { name: 'Analytics', icon: BarChart3, path: '/recruiter/analytics' },
    { name: 'Question Bank', icon: BookOpen, path: '/recruiter/questions' },
  ];

  const studentLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'AI Interview', icon: Users, path: '/student/interview' },
    { name: 'Practice Arena', icon: Zap, path: '/student/practice' },
    { name: 'Performance Reports', icon: BarChart3, path: '/student/reports' },
  ];

  const links = role === 'Recruiter' ? recruiterLinks : studentLinks;

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-zinc-950 border-r border-zinc-900 flex flex-col p-6">
      <Link to="/" className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xl font-display font-bold text-white tracking-tight">Interview<span className="text-violet-500">.ai</span></span>
      </Link>

      <div className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-2 mb-4">Main Menu</p>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-violet-600/10 text-violet-500 border border-violet-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="pt-8 border-t border-zinc-900 space-y-2">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-2 mb-4">Support</p>
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <Link to="/help" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-all">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Help Center</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/60 hover:bg-red-500/5 hover:text-red-500 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
