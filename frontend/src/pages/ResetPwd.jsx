import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';

const ResetPwd = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
      
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
            <span className="text-sm font-bold text-white tracking-tight">Interview.ai</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white">New Password</h1>
          <p className="text-zinc-500">Please choose a secure new password</p>
        </div>

        <Card className="p-8 space-y-6 shadow-premium">
          <Input 
            label="New Password" 
            placeholder="••••••••" 
            type="password" 
          />
          <Input 
            label="Confirm New Password" 
            placeholder="••••••••" 
            type="password" 
          />
          <Button className="w-full py-4 text-base">
            Update Password
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ResetPwd;
