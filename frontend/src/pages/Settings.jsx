import React from 'react';
import { User, Mail, Shield, Bell, CreditCard, LogOut } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-white font-display">Account Settings</h2>
        <p className="text-slate-400 text-sm">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden">
        <div className="p-0 divide-y divide-slate-900">
          {[
            { label: 'Profile Information', desc: 'Update your name, bio, and avatar', icon: User },
            { label: 'Email Notifications', desc: 'Control which emails you receive', icon: Mail },
            { label: 'Security & Password', desc: 'Manage your authentication and login sessions', icon: Shield },
            { label: 'Platform Preferences', desc: 'Customize your dashboard experience', icon: Bell },
            { label: 'Billing & Subscription', desc: 'Manage your plan and payment methods', icon: CreditCard },
          ].map((item, i) => (
            <div key={i} className="p-8 flex items-center justify-between group hover:bg-slate-900/30 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-all border border-slate-800 group-hover:border-emerald-500/50">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg text-white font-bold">{item.label}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
              <button className="text-slate-700 group-hover:text-white transition-all font-bold text-sm">Configure</button>
            </div>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 text-red-500 font-bold hover:gap-3 transition-all">
        <LogOut className="w-5 h-5" />
        Log out from all devices
      </button>
    </div>
  );
};

export default Settings;
