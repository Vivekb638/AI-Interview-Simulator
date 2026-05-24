import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Terminal, Cpu, Database, Globe, Layers, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';

const CATEGORY_ICONS = {
  'Arrays': Terminal,
  'Strings': Code2,
  'System Design': Cpu,
  'Databases': Database
};

const CATEGORY_COLORS = {
  'Arrays': 'emerald',
  'Strings': 'blue',
  'System Design': 'purple',
  'Databases': 'orange'
};

const PracticeArena = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await apiClient.get('/problems');
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-white font-display">Practice Arena</h2>
        <p className="text-slate-400 text-sm">Sharpen your skills with AI-powered mock sessions and targeted technical challenges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <p className="text-zinc-500">Loading dynamic challenges...</p>
        ) : (
          problems.map((problem) => {
            const Icon = CATEGORY_ICONS[problem.category] || Layers;
            const colorName = CATEGORY_COLORS[problem.category] || 'violet';
            return (
              <motion.div
                key={problem.id}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 bg-${colorName}-500/10 rounded-2xl flex items-center justify-center text-${colorName}-500 mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl text-white font-bold mb-2">{problem.title}</h3>
                  <div className="flex gap-2 mb-6">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded bg-zinc-900 border border-zinc-800 ${problem.difficulty === 'Easy' ? 'text-emerald-500' : problem.difficulty === 'Medium' ? 'text-orange-500' : 'text-red-500'}`}>
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {problem.category}
                    </span>
                  </div>
                </div>
                <Link to={`/student/assessment/${problem.id}`} className="block w-full mt-4">
                  <button className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-500 transition-all">Solve Challenge</button>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PracticeArena;
