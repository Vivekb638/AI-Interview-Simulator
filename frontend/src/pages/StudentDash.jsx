import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  Code2, 
  Trophy, 
  ArrowUpRight, 
  ChevronRight,
  Play,
  History
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const StudentDash = () => {
  const navigate = useNavigate();
  const practiceSessions = [
    { title: 'Data Structures', level: 'Intermediate', lang: 'Python', icon: Code2, path: '/student/assessment' },
    { title: 'System Design', level: 'Advanced', lang: 'Design', icon: Zap, path: '/student/practice' },
    { title: 'Behavioral Prep', level: 'Beginner', lang: 'AI Agent', icon: Target, path: '/student/interview' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Welcome */}
      <Card className="bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent border-violet-500/20 p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="violet">Interview Season is Here</Badge>
          <h1 className="text-4xl font-display font-bold text-white">Sharpen your skills, <br />land your dream job.</h1>
          <p className="text-zinc-400 font-medium">Practice with AI-driven technical interviews that simulate real FAANG environments.</p>
          <div className="flex gap-4 pt-4">
             <Link to="/student/interview">
               <Button className="px-8">Start AI Interview <Play className="w-4 h-4 fill-white" /></Button>
             </Link>
             <Link to="/student/assessment">
               <Button variant="secondary" className="px-8">Practice Coding</Button>
             </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block">
           <Trophy className="w-64 h-64" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-xl font-bold text-white">Practice Arena</h3>
             <Link to="/student/practice" className="text-sm font-bold text-violet-500 flex items-center gap-1 hover:text-violet-400">
                Explore all tracks <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practiceSessions.map((p, i) => (
              <Card 
                key={i} 
                className="hover:border-violet-500/50 group transition-all cursor-pointer"
                onClick={() => navigate(p.path)}
              >
                <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-violet-500 border border-zinc-800 transition-colors">
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="mt-6 space-y-2">
                  <h4 className="text-white font-bold">{p.title}</h4>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{p.lang}</span>
                     <Badge variant={p.level === 'Advanced' ? 'red' : 'violet'}>{p.level}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <Card className="p-8 space-y-6 border-zinc-900/50">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Growth Analytics</h3>
                <div className="flex gap-2">
                   <Badge variant="emerald">+12% vs last week</Badge>
                </div>
             </div>
             <div className="h-48 bg-zinc-950/50 rounded-2xl border border-zinc-900 flex items-end justify-between p-6 gap-2">
                {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ duration: 1, delay: i * 0.1 }}
                     className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                   />
                ))}
             </div>
          </Card>
        </div>

        {/* Recent History */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-white">Recent History</h3>
              <History className="w-5 h-5 text-zinc-600" />
           </div>
           <div className="space-y-4">
              {[
                 { date: 'Oct 12', type: 'AI Interview', score: 85, status: 'Completed' },
                 { date: 'Oct 10', type: 'Coding Task', score: 92, status: 'Excellent' },
                 { date: 'Oct 08', type: 'Mock Round', score: 40, status: 'Needs Prep' },
              ].map((h, i) => (
                 <Card key={i} className="flex justify-between items-center p-4 border-zinc-900/30">
                    <div className="flex items-center gap-4">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{h.date.split(' ')[0]}</p>
                          <p className="text-sm font-bold text-white">{h.date.split(' ')[1]}</p>
                       </div>
                       <div className="w-px h-6 bg-zinc-800" />
                       <div>
                          <p className="text-sm font-bold text-zinc-200">{h.type}</p>
                          <p className={`text-[10px] font-bold uppercase ${h.score > 80 ? 'text-emerald-500' : 'text-orange-500'}`}>{h.status}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-white">{h.score}%</p>
                    </div>
                 </Card>
              ))}
           </div>
           <Link to="/student/reports" className="block w-full">
             <Button variant="secondary" className="w-full">View all history</Button>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;
