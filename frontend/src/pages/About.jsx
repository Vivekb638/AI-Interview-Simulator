import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Target, Shield, Zap } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const About = () => {
  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="bg-mesh" />
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="violet">Our Mission</Badge>
          <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white leading-[1.1] tracking-tighter">
            We're building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 italic">future of hiring.</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Our goal is to make recruitment faster, fairer, and more accurate by leveraging the power of Artificial Intelligence to evaluate talent based on pure skill and potential.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
              { label: 'Users Worldwide', value: '500k+' },
              { label: 'Assessments Conducted', value: '2M+' },
              { label: 'Time Saved', value: '40k hrs' },
              { label: 'Accuracy Rate', value: '98.4%' },
           ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                 <p className="text-4xl md:text-5xl font-display font-bold text-white">{stat.value}</p>
                 <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
           ))}
        </div>

        {/* Our Story / Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-4xl font-display font-bold text-white">Why we started</h2>
                 <p className="text-zinc-400 leading-relaxed">
                    Interviewing.ai was born out of frustration with the traditional hiring process. We saw brilliant engineers getting filtered out by flawed resumes and biased interviews. We decided to build a platform where talent is the only metric that matters.
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                    { icon: Shield, title: 'Integritiy First', desc: 'We prioritize secure and honest assessment environments.' },
                    { icon: Heart, title: 'Human Centric', desc: 'AI should empower people, not replace the human touch in culture.' },
                 ].map((v, i) => (
                    <div key={i} className="space-y-4">
                       <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-500">
                          <v.icon className="w-5 h-5" />
                       </div>
                       <h4 className="text-white font-bold">{v.title}</h4>
                       <p className="text-zinc-500 text-sm">{v.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-violet-600/10 blur-[100px] -z-10" />
              <Card className="aspect-[4/3] bg-zinc-950 p-0 overflow-hidden border-zinc-900 flex items-center justify-center">
                 <div className="text-center space-y-6">
                    <Globe className="w-24 h-24 text-zinc-800 mx-auto animate-spin-slow" />
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">Founded in San Francisco · 2024</p>
                 </div>
              </Card>
           </div>
        </div>

        {/* CTA */}
        <Card className="p-16 text-center space-y-8 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/20">
           <h2 className="text-4xl font-display font-bold text-white">Join the revolution in recruitment.</h2>
           <p className="text-zinc-400 max-w-2xl mx-auto">
              Whether you're a candidate looking for your next challenge or a recruiter looking for elite talent, we're here to help.
           </p>
           <div className="flex justify-center gap-4">
              <Button>Explore Careers</Button>
              <Button variant="secondary">Partner with Us</Button>
           </div>
        </Card>

      </div>
    </div>
  );
};

export default About;
