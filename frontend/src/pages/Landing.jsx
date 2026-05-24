import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Code2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Video, 
  Users, 
  Cpu, 
  CheckCircle2,
  ArrowUpRight,
  Globe,
  Share2,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="relative">
      <div className="bg-mesh" />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium"
          >
            <Badge variant="violet">New</Badge>
            <span>v2.0: AI-powered behavioral scoring is here</span>
            <ArrowRight className="w-4 h-4 text-zinc-600" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-extrabold text-white leading-[1.1] tracking-tighter"
          >
            Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 italic">Elite Talent</span> <br />
            with Zero Friction.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
          >
            Automate your screening process with AI-driven technical and behavioral interviews. 
            Assess code in real-time, monitor anti-cheat violations, and rank candidates instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/signup">
              <Button className="px-10 py-5 text-lg">Start Free Trial <ArrowRight className="w-5 h-5" /></Button>
            </Link>
            <Button variant="secondary" className="px-10 py-5 text-lg">Book a Demo</Button>
          </motion.div>

          {/* Hero Visual: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-6xl mx-auto mt-24"
          >
            <div className="absolute inset-0 bg-violet-500/20 blur-[100px] -z-10" />
            <div className="p-2 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="bg-zinc-950 rounded-[32px] border border-zinc-800 aspect-[16/9] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-cyan-500/10 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center shadow-2xl shadow-violet-600/40 cursor-pointer hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-white fill-white" />
                   </div>
                </div>
                {/* Floating UI Cards */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-12 right-12 w-64 glass-card p-4 border-violet-500/30"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="emerald">Live</Badge>
                    <Users className="w-4 h-4 text-zinc-500" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Current Session</p>
                  <p className="text-white font-bold">Frontend Engineer Case</p>
                  <div className="mt-4 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-[72%]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 border-y border-zinc-900/50 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-12">Trusted by fast-growing engineering teams</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-bold">VERCEL</span>
            <span className="text-2xl font-bold">LINEAR</span>
            <span className="text-2xl font-bold">STRIPE</span>
            <span className="text-2xl font-bold">GITHUB</span>
            <span className="text-2xl font-bold">CLERK</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Full-stack hiring infrastructure.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to evaluate talent, from technical skill assessments to cultural fit analysis.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Video, title: 'AI Video Interviews', desc: 'Autonomous AI agents that conduct behavioral and technical rounds with natural dialogue.' },
              { icon: Code2, title: 'Coding Assessments', desc: 'Live environments with support for 20+ languages and automated test case verification.' },
              { icon: ShieldCheck, title: 'Anti-Cheat Engine', desc: 'Real-time eye-tracking, tab-detection, and audio analysis to ensure assessment integrity.' },
              { icon: BarChart3, title: 'Live Analytics', desc: 'Deep candidate insights with technical scorecards and behavioral personality mapping.' },
              { icon: Cpu, title: 'Resume Intelligence', desc: 'Neural parsing that matches candidate experience with your specific job requirements.' },
              { icon: Zap, title: 'Realtime Collab', desc: 'Shared interview rooms with shared state, perfect for collaborative hiring panels.' },
            ].map((f, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full space-y-6 group border-zinc-800/30">
                  <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl text-white font-bold">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Anti-Cheat Showcase */}
      <section className="py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Badge variant="violet">Security</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">Advanced Anti-Cheat <br />Monitoring System.</h2>
            <div className="space-y-6">
              {[
                { title: 'Biometric Verification', desc: 'AI verifies candidate identity throughout the session using facial recognition.' },
                { title: 'Browser Lock', desc: 'Detects tab switching, copy-pasting, and multiple monitor usage instantly.' },
                { title: 'Audio Fingerprinting', desc: 'Identifies external help or speech from unauthorized participants.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-500 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-fit">View Security whitepaper</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 blur-[100px] -z-10" />
            <Card className="border-red-500/20 bg-zinc-950 p-0 overflow-hidden">
               <div className="p-4 bg-red-500/10 flex items-center justify-between border-b border-red-500/20">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Security Violation Detected</span>
                  </div>
                  <span className="text-[10px] text-red-500/50">Session ID: 482-12</span>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="text-zinc-400 text-sm">Suspicious Activity</p>
                     <p className="text-white font-bold">Tab Switch (2x)</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-zinc-400 text-sm">Audio Status</p>
                     <p className="text-orange-500 font-bold">Multiple Voices</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-900">
                     <p className="text-[10px] font-bold text-zinc-600 uppercase mb-4 tracking-widest">AI Verdict</p>
                     <div className="p-4 bg-zinc-900 rounded-xl">
                        <p className="text-xs text-zinc-400 leading-relaxed italic">"Candidate flagged for high suspicion of using external resources. Recommending immediate review of screen logs."</p>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Simple, transparent pricing.</h2>
            <p className="text-zinc-400">Scale your hiring without breaking the bank.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="p-10 border-zinc-800 text-left space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-zinc-400">Starter</h3>
                   <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">$0</span>
                      <span className="text-zinc-500">/mo</span>
                   </div>
                </div>
                <ul className="space-y-4 text-sm text-zinc-400">
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> 5 Interviews / mo</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Basic AI Scoring</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Shared Dashboards</li>
                </ul>
                <Button variant="secondary" className="w-full">Get Started</Button>
             </Card>

             <Card className="p-10 border-violet-500/50 bg-violet-500/5 text-left space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1 bg-violet-600 text-[10px] font-bold uppercase text-white rounded-bl-xl">Popular</div>
                <div>
                   <h3 className="text-xl font-bold text-white">Pro</h3>
                   <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">$49</span>
                      <span className="text-zinc-500">/mo</span>
                   </div>
                </div>
                <ul className="space-y-4 text-sm text-zinc-400">
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Unlimited Interviews</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Advanced Anti-Cheat</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Custom Question Bank</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Resume Analyzer</li>
                </ul>
                <Button className="w-full">Choose Pro</Button>
             </Card>

             <Card className="p-10 border-zinc-800 text-left space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-zinc-400">Enterprise</h3>
                   <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">Custom</span>
                   </div>
                </div>
                <ul className="space-y-4 text-sm text-zinc-400">
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Dedicated Account Manager</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> SSO & SAML Integration</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500" /> On-premise Deployment</li>
                </ul>
                <Button variant="secondary" className="w-full">Contact Sales</Button>
             </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-20 px-6 border-t border-zinc-900/50">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
               <div className="col-span-1 md:col-span-2 space-y-8">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-lg font-display font-bold text-white">Interview<span className="text-violet-500">.ai</span></span>
                  </div>
                  <p className="text-zinc-500 max-w-sm leading-relaxed">
                    Building the future of recruitment through artificial intelligence and secure assessment environments.
                  </p>
                  <div className="flex gap-4">
                     <Globe className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                     <Share2 className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                     <Info className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                  </div>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.2em]">Product</h4>
                  <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/features">AI Interview</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/features">Coding Tests</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/features">Anti-Cheat</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/features">Question Bank</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.2em]">Company</h4>
                  <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">About</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">Careers</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">Blog</Link></li>
                     <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">Security</Link></li>
                  </ul>
               </div>
            </div>
            <div className="mt-32 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-6">
               <p className="text-xs text-zinc-600">© 2026 Interview.ai. All rights reserved.</p>
               <div className="flex gap-8 text-xs text-zinc-600">
                  <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-white cursor-pointer">Terms of Service</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
