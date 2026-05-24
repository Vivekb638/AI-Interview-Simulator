import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { BarChart3, TrendingUp, Calendar, Trophy, Download, Clock, Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentReports = () => {
  const reports = [
    { id: 'INT-4092', date: 'Oct 12, 2026', type: 'AI Interview', topic: 'Frontend Architecture', score: 85, duration: '45 mins', status: 'Completed' },
    { id: 'COD-1192', date: 'Oct 10, 2026', type: 'Coding Task', topic: 'Data Structures', score: 92, duration: '30 mins', status: 'Excellent' },
    { id: 'INT-3928', date: 'Oct 08, 2026', type: 'Mock Round', topic: 'Behavioral', score: 40, duration: '20 mins', status: 'Needs Prep' },
    { id: 'COD-1044', date: 'Oct 05, 2026', type: 'Coding Task', topic: 'Dynamic Programming', score: 78, duration: '40 mins', status: 'Good' },
    { id: 'INT-3811', date: 'Oct 01, 2026', type: 'AI Interview', topic: 'System Design', score: 65, duration: '50 mins', status: 'Average' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Performance Reports</h1>
          <p className="text-zinc-400 mt-1">Analyze your historical interview scores and coding assessments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
        </div>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
           <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Trophy className="w-5 h-5" />
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">72%</p>
              <p className="text-sm font-medium text-zinc-500">Average Overall Score</p>
           </div>
           <Badge variant="emerald" className="inline-flex gap-1"><TrendingUp className="w-3 h-3" /> +14% this month</Badge>
        </Card>
        
        <Card className="p-6 space-y-4">
           <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <Star className="w-5 h-5" />
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">Top 15%</p>
              <p className="text-sm font-medium text-zinc-500">Platform Ranking</p>
           </div>
           <Badge variant="cyan" className="inline-flex gap-1">Highly Competitive</Badge>
        </Card>

        <Card className="p-6 space-y-4">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">12.5 hrs</p>
              <p className="text-sm font-medium text-zinc-500">Total Practice Time</p>
           </div>
           <Badge variant="zinc" className="inline-flex gap-1">14 sessions completed</Badge>
        </Card>
      </div>

      {/* Detailed Reports Table */}
      <Card className="p-0 overflow-hidden border-zinc-900/50">
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Session History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-900">
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Session ID</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date & Time</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type & Topic</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Score</th>
                <th className="text-right py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {reports.map((report, i) => (
                <tr key={i} className="group hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-xs font-mono font-bold text-zinc-500">{report.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                       <Calendar className="w-4 h-4 text-zinc-500" />
                       {report.date}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                       <p className="text-sm font-bold text-zinc-200">{report.type}</p>
                       <p className="text-xs text-zinc-500 font-medium">{report.topic} • {report.duration}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${report.score > 80 ? 'bg-emerald-500' : report.score > 50 ? 'bg-violet-500' : 'bg-orange-500'}`} 
                          style={{ width: `${report.score}%` }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-white">{report.score}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link to={`/student/reports/${report.id}`}>
                       <Button variant="secondary" className="px-3 py-1.5 text-xs h-auto bg-zinc-900 hover:bg-zinc-800">
                         View Details
                       </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentReports;
