import React from 'react';
import { FileText, Download, Share2, Search, Filter, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl text-white font-display">Interview Reports</h2>
          <p className="text-slate-400 text-sm">Access detailed scorecards, transcripts, and AI analysis for all completed interviews.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export All Data
        </button>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-slate-900 flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search by candidate or job..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all" />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-3 rounded-xl glass text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold transition-all">
              <Calendar className="w-4 h-4" />
              This Month
            </button>
            <button className="px-4 py-3 rounded-xl glass text-slate-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase font-bold tracking-widest border-b border-slate-900">
                <th className="py-6 px-8">Candidate</th>
                <th className="py-6 px-8">Interview Type</th>
                <th className="py-6 px-8">Date</th>
                <th className="py-6 px-8">Score</th>
                <th className="py-6 px-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {[
                { name: 'Alex Rivera', role: 'Frontend', type: 'AI Technical', date: 'May 12, 2026', score: '92/100' },
                { name: 'Jordan Smith', role: 'Backend', type: 'System Design', date: 'May 10, 2026', score: '78/100' },
                { name: 'Casey Lee', role: 'Mobile', type: 'Behavioral', date: 'May 08, 2026', score: '85/100' },
                { name: 'Morgan Page', role: 'DevOps', type: 'Live Coding', date: 'May 05, 2026', score: '64/100' },
              ].map((report, i) => (
                <tr key={i} className="group hover:bg-slate-900/30 transition-all">
                  <td className="py-6 px-8">
                    <p className="text-sm font-bold text-white mb-1">{report.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{report.role}</p>
                  </td>
                  <td className="py-6 px-8 text-sm text-slate-400">{report.type}</td>
                  <td className="py-6 px-8 text-sm text-slate-400">{report.date}</td>
                  <td className="py-6 px-8">
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{report.score}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg glass text-slate-500 hover:text-white transition-all"><FileText className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg glass text-slate-500 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
