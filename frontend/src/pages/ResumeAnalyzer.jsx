import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Upload, CheckCircle, Brain, Target, Star } from 'lucide-react';

const ResumeAnalyzer = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-white font-display">AI Resume Analyzer</h2>
        <p className="text-slate-400 text-sm">Deep scan candidate resumes to match skills, experience, and cultural fit using neural processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bento-item min-h-[500px] border-dashed border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center gap-6 group hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all cursor-pointer">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl text-white font-bold">Drop resume here or browse</h3>
            <p className="text-slate-500 text-sm">Support PDF, DOCX (Max 10MB)</p>
          </div>
          <button className="btn-primary mt-4">Upload Resume</button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[32px] space-y-6">
            <h3 className="text-lg text-white font-display">Analysis Factors</h3>
            <div className="space-y-6">
              {[
                { label: 'Technical Stack', icon: Brain },
                { label: 'Experience Depth', icon: Target },
                { label: 'Project Impact', icon: Star },
                { label: 'Keyword Matching', icon: FileSearch },
              ].map((factor, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-2 bg-slate-900 rounded-xl text-slate-500">
                    <factor.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-slate-400 font-medium">{factor.label}</span>
                  <CheckCircle className="ml-auto w-4 h-4 text-emerald-500/30" />
                </div>
              ))}
            </div>
          </div>

          <div className="bento-item bg-blue-500 shadow-2xl shadow-blue-500/20 text-white">
            <h3 className="text-xl font-display font-bold mb-4">Instant Ranking</h3>
            <p className="text-blue-50 text-xs opacity-90 leading-relaxed mb-6">Our AI ranks candidates based on your specific job description and historical hire data.</p>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1 }} className="h-full bg-white" />
            </div>
            <p className="text-[10px] font-bold mt-2 text-blue-100 uppercase tracking-widest">Processing Speed: 1.2s / File</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
