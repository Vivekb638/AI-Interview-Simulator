import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Input } from '../components/ui';
import { Search, Filter, MoreHorizontal, Mail, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const candidates = [
    { id: 'C-001', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Senior React Developer', score: 92, status: 'Hired', lastActive: '2h ago', aiFlag: false },
    { id: 'C-002', name: 'Sarah Chen', email: 'schen99@example.com', role: 'Fullstack Engineer', score: 88, status: 'Pending Review', lastActive: '4h ago', aiFlag: false },
    { id: 'C-003', name: 'Michael Ross', email: 'm.ross.dev@example.com', role: 'DevOps Architect', score: 45, status: 'Flagged', lastActive: '5h ago', aiFlag: true },
    { id: 'C-004', name: 'Elena Gilbert', email: 'elena.designs@example.com', role: 'UI/UX Designer', score: 85, status: 'In Progress', lastActive: 'Live', aiFlag: false },
    { id: 'C-005', name: 'David Kim', email: 'dkim.codes@example.com', role: 'Backend Engineer', score: 95, status: 'Hired', lastActive: '1d ago', aiFlag: false },
    { id: 'C-006', name: 'Rachel Green', email: 'rachel.g@example.com', role: 'Product Manager', score: 32, status: 'Rejected', lastActive: '2d ago', aiFlag: false },
  ];

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Candidate Pipeline</h1>
          <p className="text-zinc-400 mt-1">Manage, evaluate, and communicate with your applicants.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
          <Button>Invite Candidate</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-zinc-900/50">
        <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/20 border-b border-zinc-900">
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Candidate Info</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Applied Role</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Assessment</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pipeline Status</th>
                <th className="text-right py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredCandidates.map((candidate, i) => (
                <tr key={i} className="group hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-zinc-200 block">{candidate.name}</span>
                        <span className="text-xs text-zinc-500 font-medium">{candidate.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-zinc-300 font-medium">{candidate.role}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${candidate.score > 80 ? 'bg-emerald-500' : candidate.score > 50 ? 'bg-violet-500' : 'bg-orange-500'}`} 
                          style={{ width: `${candidate.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{candidate.score}%</span>
                      {candidate.aiFlag && (
                        <ShieldAlert className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={
                      candidate.status === 'Flagged' || candidate.status === 'Rejected' ? 'red' : 
                      candidate.status === 'Hired' ? 'emerald' : 
                      candidate.status === 'Pending Review' ? 'cyan' : 'violet'
                    }>
                      {candidate.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-zinc-500 hover:text-white bg-zinc-900 rounded-lg transition-colors">
                         <Mail className="w-4 h-4" />
                       </button>
                       <Link to={`/recruiter/reports/${candidate.id}`}>
                         <button className="p-2 text-zinc-500 hover:text-white bg-zinc-900 rounded-lg transition-colors">
                           <ExternalLink className="w-4 h-4" />
                         </button>
                       </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Candidates;
