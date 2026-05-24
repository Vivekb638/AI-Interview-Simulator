import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Code2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Video, 
  Globe, 
  Lock, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const Features = () => {
  const features = [
    {
      title: "AI Interviewer",
      desc: "Autonomous agents capable of conducting natural, conversational interviews for technical and behavioral roles.",
      icon: Video,
      color: "violet"
    },
    {
      title: "Real-time Coding",
      desc: "Integrated IDE with support for 20+ languages, automated test runners, and multi-file project support.",
      icon: Code2,
      color: "emerald"
    },
    {
      title: "Anti-Cheat Engine",
      desc: "Advanced eye-tracking, tab-switching detection, and browser lock-down to ensure assessment integrity.",
      icon: ShieldCheck,
      color: "red"
    },
    {
      title: "Skill Fingerprinting",
      desc: "Deep analysis of candidate coding patterns to identify expertise levels and potential plagiarism.",
      icon: Search,
      color: "cyan"
    },
    {
      title: "Predictive Analytics",
      desc: "AI-driven scoring that predicts job performance based on technical ability and behavioral traits.",
      icon: BarChart3,
      color: "violet"
    },
    {
      title: "Enterprise Security",
      desc: "Bank-grade encryption, SOC2 compliance, and custom data retention policies for large organizations.",
      icon: Lock,
      color: "zinc"
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="bg-mesh" />
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="violet">Platform Capabilities</Badge>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-tight">
            Everything you need <br /> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 italic">hire the best.</span>
          </h1>
          <p className="text-xl text-zinc-400">
            A comprehensive suite of AI-powered tools designed to streamline your recruitment pipeline and eliminate bias.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full space-y-6 group">
                <div className={`w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-violet-500/50 transition-all`}>
                  <f.icon className="w-6 h-6 text-violet-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl text-white font-bold">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-sm font-bold text-violet-500 cursor-pointer group/link">
                   Learn more <Zap className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="pt-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold text-white">How it works</h2>
              <div className="space-y-8">
                 {[
                    { step: '01', title: 'Create Assessment', desc: 'Define your job requirements and pick questions from our bank of 10,000+ problems.' },
                    { step: '02', title: 'Invite Candidates', desc: 'Send bulk invites or integrate with your Greenhouse/Lever ATS.' },
                    { step: '03', title: 'AI Evaluation', desc: 'Our AI conducts the interview and ranks candidates based on pure technical data.' },
                 ].map((s, i) => (
                    <div key={i} className="flex gap-6">
                       <span className="text-4xl font-display font-black text-zinc-800">{s.step}</span>
                       <div className="space-y-2">
                          <h4 className="text-xl font-bold text-white">{s.title}</h4>
                          <p className="text-zinc-500 text-sm">{s.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <Card className="aspect-square bg-zinc-950 border-zinc-900 flex items-center justify-center p-0 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border border-violet-500/20 flex items-center justify-center animate-pulse-slow">
                       <div className="w-48 h-48 rounded-full border border-violet-500/40 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                             <Cpu className="w-12 h-12 text-white" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default Features;
