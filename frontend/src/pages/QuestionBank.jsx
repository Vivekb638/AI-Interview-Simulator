import React from 'react';
import { Database, Plus, Search, Code, Globe, Terminal, Layers, MoreVertical } from 'lucide-react';

const QuestionBank = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl text-white font-display">Question Bank</h2>
          <p className="text-slate-400 text-sm">Manage your curated list of technical and behavioral questions used across the platform.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Question
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'All', count: 1250, active: true },
          { label: 'Frontend', count: 432, active: false },
          { label: 'Backend', count: 388, active: false },
          { label: 'DevOps', count: 124, active: false },
        ].map((tab, i) => (
          <button key={i} className={`p-6 rounded-[24px] text-left transition-all ${tab.active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'glass text-slate-500 hover:text-white'}`}>
            <p className="text-sm font-bold mb-1">{tab.label}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${tab.active ? 'text-emerald-100' : 'text-slate-600'}`}>{tab.count} Questions</p>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden">
        <div className="p-0 divide-y divide-slate-900">
          {[
            { title: 'Explain the difference between let, const, and var.', category: 'Frontend', difficulty: 'Easy', icon: Globe },
            { title: 'Design a scalable notification system.', category: 'System Design', difficulty: 'Hard', icon: Layers },
            { title: 'Implement a LRU Cache.', category: 'Data Structures', difficulty: 'Medium', icon: Terminal },
            { title: 'What is CAP Theorem?', category: 'Backend', difficulty: 'Medium', icon: Code },
          ].map((q, i) => (
            <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-900/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-all">
                  <q.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{q.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{q.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' : q.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg glass text-slate-600 hover:text-white transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
