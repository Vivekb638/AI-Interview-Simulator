import React from 'react';
import { Bell, Video, Award, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-white font-display">Notifications</h2>
        <p className="text-slate-400 text-sm">Stay updated with your interview invitations, results, and platform updates.</p>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden">
        <div className="p-0 divide-y divide-slate-900">
          {[
            { title: 'Interview Invitation', desc: 'Google invited you for a Senior Frontend role.', time: '2 hours ago', icon: Video, color: 'text-emerald-500' },
            { title: 'AI Scoring Complete', desc: 'Your scorecard for the Meta interview is ready.', time: '5 hours ago', icon: Award, color: 'text-blue-500' },
            { title: 'New Message', desc: 'Recruiter from Stripe sent you a message.', time: 'Yesterday', icon: MessageSquare, color: 'text-purple-500' },
            { title: 'Security Alert', desc: 'New login detected from a Chrome on Linux.', time: '2 days ago', icon: AlertTriangle, color: 'text-orange-500' },
            { title: 'Account Verified', desc: 'Your identification documents have been approved.', time: '3 days ago', icon: CheckCircle, color: 'text-emerald-500' },
          ].map((notif, i) => (
            <div key={i} className="p-8 flex items-center justify-between group hover:bg-slate-900/30 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center ${notif.color} border border-slate-800 group-hover:border-current transition-all`}>
                  <notif.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg text-white font-bold">{notif.title}</h4>
                  <p className="text-sm text-slate-500">{notif.desc}</p>
                </div>
              </div>
              <span className="text-xs text-slate-700 group-hover:text-slate-500 transition-all font-bold uppercase tracking-widest">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
