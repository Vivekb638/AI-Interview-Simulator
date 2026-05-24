import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Target,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const RecruiterDash = () => {
  const stats = [
    { label: 'Total Candidates', value: '1,284', change: '+12.5%', icon: Users, color: 'violet' },
    { label: 'Active Interviews', value: '42', change: '+5.2%', icon: Calendar, color: 'emerald' },
    { label: 'Pending Reviews', value: '18', change: '-2.4%', icon: Clock, color: 'cyan' },
    { label: 'Security Alerts', value: '3', change: 'Critical', icon: ShieldAlert, color: 'red' },
  ];

  const recentInterviews = [
    { name: 'Alex Johnson', role: 'Senior React Developer', score: 92, status: 'Completed', time: '2h ago' },
    { name: 'Sarah Chen', role: 'Fullstack Engineer', score: 88, status: 'Completed', time: '4h ago' },
    { name: 'Michael Ross', role: 'DevOps Architect', score: 45, status: 'Flagged', time: '5h ago' },
    { name: 'Elena Gilbert', role: 'UI/UX Designer', score: 0, status: 'In Progress', time: 'Live' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Welcome back, Vineet</h1>
          <p className="text-zinc-500 mt-1 font-medium">Here's what's happening with your recruitment pipeline today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/recruiter/reports">
            <Button variant="secondary">Download Reports</Button>
          </Link>
          <Link to="/recruiter/live-monitoring">
            <Button>Live Monitoring</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-[40px] -z-10 group-hover:bg-${stat.color}-500/10 transition-all`} />
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 border border-${stat.color}-500/20`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold ${stat.color === 'red' ? 'text-red-500' : 'text-emerald-500'} bg-${stat.color}-500/5 px-2 py-0.5 rounded-full border border-${stat.color}-500/10`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-zinc-500 mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid: Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Interviews Table */}
        <Card className="lg:col-span-2 p-0 overflow-hidden border-zinc-900/50">
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Interviews</h3>
            <Link to="/recruiter/candidates" className="text-sm font-bold text-violet-500 hover:text-violet-400 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-900">
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Candidate</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Score</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {recentInterviews.map((interview, i) => (
                  <tr key={i} className="group hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                          {interview.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-zinc-200">{interview.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-zinc-400 font-medium">{interview.role}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${interview.score > 70 ? 'bg-emerald-500' : interview.score > 40 ? 'bg-orange-500' : 'bg-red-500'}`} 
                            style={{ width: `${interview.score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-white">{interview.score || '--'}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={interview.status === 'Flagged' ? 'red' : interview.status === 'Completed' ? 'emerald' : 'violet'}>
                        {interview.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-1 text-zinc-600 hover:text-white">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Mini Widgets */}
        <div className="space-y-8">
           <Card className="space-y-6">
              <h3 className="text-lg font-bold text-white">Pipeline Velocity</h3>
              <div className="space-y-4">
                 {[
                    { label: 'Screening', count: 124, progress: 80 },
                    { label: 'AI Round', count: 42, progress: 40 },
                    { label: 'Technical', count: 18, progress: 20 },
                    { label: 'Hired', count: 5, progress: 10 },
                 ].map((p, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-medium">
                          <span className="text-zinc-400">{p.label}</span>
                          <span className="text-white">{p.count}</span>
                       </div>
                       <div className="h-1.5 w-full bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden">
                          <div className="h-full bg-violet-600 rounded-full" style={{ width: `${p.progress}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/30 p-8 text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Target className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-white">Advanced Insights</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                 Upgrade to Enterprise to unlock multi-face detection and custom personality mapping.
              </p>
              <Link to="/pricing" className="block w-full">
                <Button className="w-full">Upgrade Now</Button>
              </Link>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDash;
