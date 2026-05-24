import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, LineChart, TrendingUp, Users, Target } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-white font-display">Hiring Analytics</h2>
        <p className="text-slate-400 text-sm">Visualize your recruitment performance, conversion rates, and talent pool diversity.</p>
      </div>

      <div className="bento-grid !p-0">
        <div className="md:col-span-8 bento-item min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg text-white font-display">Conversion Funnel</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg">Week</button>
              <button className="px-3 py-1 glass text-slate-500 text-[10px] font-bold rounded-lg">Month</button>
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <BarChart3 className="w-32 h-32 text-slate-800" />
            <p className="text-slate-500 text-sm font-medium">Chart visualization pending data...</p>
          </div>
        </div>

        <div className="md:col-span-4 bento-item">
          <h3 className="text-lg text-white font-display mb-6">Top Channels</h3>
          <div className="space-y-6">
            {[
              { label: 'LinkedIn', value: 45, color: 'bg-blue-500' },
              { label: 'Referrals', value: 32, color: 'bg-emerald-500' },
              { label: 'GitHub', value: 15, color: 'bg-purple-500' },
              { label: 'Indeed', value: 8, color: 'bg-orange-500' },
            ].map((channel, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">{channel.label}</span>
                  <span className="text-white font-bold">{channel.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full ${channel.color}`} style={{ width: `${channel.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bento-item">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 w-fit mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="text-xl text-white font-bold mb-2">Time to Hire</h4>
          <p className="text-3xl text-white font-display font-bold">12.4 Days</p>
          <p className="text-xs text-emerald-500 mt-2 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            15% faster than last month
          </p>
        </div>

        <div className="md:col-span-4 bento-item">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 w-fit mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-xl text-white font-bold mb-2">Interview Pass Rate</h4>
          <p className="text-3xl text-white font-display font-bold">28.5%</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">Out of 432 sessions</p>
        </div>

        <div className="md:col-span-4 bento-item">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500 w-fit mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-xl text-white font-bold mb-2">Offer Acceptance</h4>
          <p className="text-3xl text-white font-display font-bold">92%</p>
          <p className="text-xs text-purple-500 mt-2 font-bold underline cursor-pointer">View Breakdown</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
