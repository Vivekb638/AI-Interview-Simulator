import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Monitor, 
  Eye, 
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Layout,
  Clock,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import socketClient from '../services/socketClient';
import { addAlert } from '../redux/slices/monitoringSlice';

const LiveMonitoring = () => {
  const dispatch = useDispatch();
  const { alerts, candidates } = useSelector((state) => state.monitoring);

  useEffect(() => {
    // Ensure interview sockets are connected
    socketClient.connectInterview();

    const handleCheatingAlert = (data) => {
      dispatch(addAlert(data));
    };

    if (socketClient.monitoringSocket) {
      socketClient.monitoringSocket.on('cheating-alert', handleCheatingAlert);
    }

    return () => {
      if (socketClient.monitoringSocket) {
        socketClient.monitoringSocket.off('cheating-alert', handleCheatingAlert);
      }
    };
  }, [dispatch]);

  // Convert candidates map to array for rendering
  const activeSessions = Object.entries(candidates).map(([id, data]) => ({
    id: id.substring(0, 5).toUpperCase(),
    candidateId: id,
    candidate: 'Candidate ' + id.substring(0, 4), // Fallback if name not passed
    role: 'Interviewee',
    status: data.highestSeverity === 'CRITICAL' ? 'Critical' : data.highestSeverity === 'HIGH' ? 'Warning' : 'Healthy',
    flags: data.warningCount,
    time: 'Live',
    lastActivity: data.lastActivity
  }));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
             <ShieldAlert className="w-8 h-8 text-violet-500" />
             Live Monitoring Hub
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">Real-time supervision of active interview sessions and anti-cheat alerts.</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Network Status: Connected</span>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <Card className="lg:col-span-3 p-0 overflow-hidden border-zinc-900/50">
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
               <h3 className="text-lg font-bold text-white">Active Sessions</h3>
               <div className="flex gap-2">
                  <Badge variant="zinc">{activeSessions.length} Total</Badge>
                  {activeSessions.filter(s => s.status === 'Critical').length > 0 && (
                    <Badge variant="red">{activeSessions.filter(s => s.status === 'Critical').length} Critical</Badge>
                  )}
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="bg-zinc-950/50 border-b border-zinc-900">
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Session ID</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Candidate</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connection</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Violations</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Runtime</th>
                        <th className="text-right py-4 px-6"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                     {activeSessions.length === 0 && (
                       <tr>
                         <td colSpan="6" className="py-8 text-center text-sm text-zinc-500">No active candidates being monitored.</td>
                       </tr>
                     )}
                     {activeSessions.map((s, i) => (
                        <tr key={i} className="group hover:bg-zinc-900/40 transition-colors">
                           <td className="py-5 px-6 font-mono text-xs text-zinc-500">{s.id}</td>
                           <td className="py-5 px-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                    {s.candidate.charAt(0)}
                                 </div>
                                 <div className="leading-none">
                                    <p className="text-sm font-bold text-zinc-200">{s.candidate}</p>
                                    <p className="text-[10px] text-zinc-600 mt-1">{s.role}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-5 px-6">
                              <div className="flex items-center gap-2">
                                 <Wifi className={`w-3.5 h-3.5 ${s.status === 'Critical' ? 'text-red-500' : 'text-emerald-500'}`} />
                                 <span className="text-xs font-medium text-zinc-400">{s.status}</span>
                              </div>
                           </td>
                           <td className="py-5 px-6">
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${s.flags > 0 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                                 <span className={`text-xs font-bold ${s.flags > 2 ? 'text-red-500' : s.flags > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {s.flags} Flags
                                 </span>
                              </div>
                           </td>
                           <td className="py-5 px-6">
                              <div className="flex items-center gap-2 text-zinc-500">
                                 <Clock className="w-3.5 h-3.5" />
                                 <span className="text-xs font-mono">{s.time}</span>
                              </div>
                           </td>
                           <td className="py-5 px-6 text-right">
                              <Button variant="secondary" className="h-8 px-3 text-[10px] py-0 gap-1 border-zinc-800">
                                 Monitor <ExternalLink className="w-3 h-3" />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         {/* Side Activity Panel */}
         <div className="space-y-6">
            <Card className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Real-time Feed</h3>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
               </div>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {alerts.length === 0 && (
                    <p className="text-xs text-zinc-500 italic">Waiting for events...</p>
                  )}
                  {alerts.map((log) => {
                     const dateObj = new Date(log.timestamp);
                     const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
                     return (
                     <div key={log.id} className="flex gap-3 text-[11px] items-start">
                        <span className="text-zinc-600 font-mono flex-shrink-0">{timeStr}</span>
                        <p className={`font-medium ${log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'HIGH' ? 'text-orange-500' : 'text-zinc-400'}`}>
                           Candidate {log.candidateId?.substring(0, 4)}: {log.type}
                        </p>
                     </div>
                     )
                  })}
               </div>
               <Button variant="ghost" className="w-full text-[10px] py-2 border border-zinc-800">View Full Event Log</Button>
            </Card>

            <Card className="bg-zinc-950 border-zinc-900 flex items-center justify-center py-10 relative group cursor-pointer overflow-hidden">
               <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-violet-600/10 transition-colors" />
               <div className="text-center relative z-10 space-y-3">
                  <Layout className="w-10 h-10 text-zinc-700 mx-auto group-hover:text-violet-500 transition-colors" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Multi-View Mode</p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
