import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  Terminal, 
  Layout, 
  Settings,
  ArrowLeft,
  Cpu,
  Clock,
  Code
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import apiClient from '../services/apiClient';
import socketClient from '../services/socketClient';
import { setupTabMonitor } from '../services/monitoring/tabMonitor';
import { setupClipboardMonitor } from '../services/monitoring/clipboardMonitor';
import { setupFullscreenMonitor } from '../services/monitoring/fullscreenMonitor';
import { setupKeyboardMonitor } from '../services/monitoring/keyboardMonitor';

const CodingAssess = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams(); // problem ID
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  const [output, setOutput] = useState([
    { type: 'info', text: 'System ready. Write your code and click Run Tests.' }
  ]);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await apiClient.get(`/problems/${id}`);
        setProblem(data);
        if (data.starterCode && data.starterCode[language]) {
          setCode(data.starterCode[language]);
        }
      } catch (err) {
        setOutput([{ type: 'error', text: 'Failed to load problem.' }]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProblem();
  }, [id]);

  // Setup Anti-Cheat Monitoring
  useEffect(() => {
    socketClient.connectInterview();
    // Join the monitoring room
    socketClient.emitToMonitoring('join-monitoring-room', { roomId: 'global-room', userId: user?.id || 'anonymous' });

    const handleViolation = (payload) => {
      // payload has type, severity, details
      socketClient.emitToMonitoring('cheating_event', payload);
      
      setOutput(prev => [...prev, { 
        type: 'error', 
        text: `[ANTI-CHEAT ALERT]: ${payload.details}. This event has been logged and sent to the recruiter.` 
      }]);
    };

    const cleanupTab = setupTabMonitor(handleViolation);
    const cleanupClipboard = setupClipboardMonitor(handleViolation);
    const cleanupFullscreen = setupFullscreenMonitor(handleViolation);
    const cleanupKeyboard = setupKeyboardMonitor(handleViolation);

    return () => {
      cleanupTab();
      cleanupClipboard();
      cleanupFullscreen();
      cleanupKeyboard();
    };
  }, [user]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem && problem.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    } else {
      setCode('');
    }
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setOutput([{ type: 'info', text: `Executing ${language} code...` }]);
    
    try {
      // For Phase 2, we just run the code with the first test case's input as stdin (if available)
      const stdin = problem?.testCases?.length > 0 ? problem.testCases[0].input : '';
      
      const response = await apiClient.post('/execute', {
        code,
        language,
        stdin
      });
      
      const newOutput = [];
      if (response.compile_output) {
        newOutput.push({ type: 'error', text: response.compile_output });
      }
      if (response.stderr) {
        newOutput.push({ type: 'error', text: response.stderr });
      }
      if (response.stdout) {
        newOutput.push({ type: 'success', text: response.stdout });
      }
      
      if (newOutput.length === 0 && response.status?.description) {
        newOutput.push({ type: 'info', text: `Status: ${response.status.description}` });
      }
      
      setOutput(newOutput);
    } catch (err) {
      setOutput([{ type: 'error', text: err.message || 'Execution failed.' }]);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center text-white">
        Loading Assessment Environment...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center text-white">
        Problem not found.
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-zinc-100 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link to="/student/practice" className="p-1.5 hover:bg-zinc-900 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 text-zinc-500" />
           </Link>
           <div className="h-4 w-px bg-zinc-800 mx-1" />
           <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-violet-500" />
              <h2 className="text-sm font-bold text-white tracking-tight">{problem.title}</h2>
              <Badge variant={problem.difficulty === 'Easy' ? 'emerald' : problem.difficulty === 'Medium' ? 'orange' : 'red'}>
                {problem.difficulty}
              </Badge>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">Time Left: 54:20</span>
           </div>
           <div className="h-6 w-px bg-zinc-800" />
           <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                className="h-8 px-3 text-xs py-0 gap-1.5"
                onClick={() => setCode(problem.starterCode[language] || '')}
              >
                 <RotateCcw className="w-3 h-3" /> Reset
              </Button>
              <Button 
                onClick={handleRunCode}
                isLoading={executing}
                className="h-8 px-4 text-xs py-0 gap-1.5 shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-500"
              >
                 <Play className="w-3 h-3 fill-white" /> Run Tests
              </Button>
           </div>
        </div>
      </header>

      {/* IDE Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Problem Statement */}
        <div className="w-[450px] border-r border-zinc-900 bg-zinc-950 flex flex-col">
           <div className="p-6 overflow-y-auto flex-1 space-y-8">
              <section className="space-y-4">
                 <h3 className="text-xl font-bold text-white">Problem Statement</h3>
                 <div className="text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {problem.description}
                 </div>
              </section>

              {problem.testCases?.map((tc, index) => (
                <section key={index} className="space-y-4">
                   <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Example {index + 1}:</h4>
                   <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                      <p><span className="text-zinc-500">Input:</span> {tc.input}</p>
                      <p><span className="text-zinc-500">Expected Output:</span> {tc.output}</p>
                   </div>
                </section>
              ))}
           </div>
           
           {/* Test Cases Panel Mini */}
           <div className="p-4 border-t border-zinc-900 bg-zinc-900/30">
              <div className="flex items-center justify-between mb-4 px-2">
                 <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Test Cases ({problem.testCases?.length || 0})</span>
              </div>
           </div>
        </div>

        {/* Right: Code Editor and Terminal */}
        <div className="flex-1 flex flex-col">
           {/* Editor Config */}
           <div className="h-12 border-b border-zinc-900 bg-[#1e1e1e] flex items-center px-4 z-10">
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-300 outline-none"
              >
                 <option value="javascript">JavaScript (Node.js)</option>
                 <option value="python">Python 3.10</option>
              </select>
           </div>
           
           <div className="flex-1 relative">
             <Editor
               height="100%"
               language={language}
               theme="vs-dark"
               value={code}
               onChange={(val) => setCode(val)}
               options={{
                 minimap: { enabled: false },
                 fontSize: 14,
                 fontFamily: 'var(--font-mono)',
                 scrollBeyondLastLine: false,
                 padding: { top: 16 }
               }}
             />
           </div>

           {/* Terminal Output */}
           <div className="h-64 border-t border-zinc-900 bg-[#0A0A0A] flex flex-col">
              <div className="h-10 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Output Terminal</span>
                 </div>
                 <button onClick={() => setOutput([])} className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase transition-colors">Clear</button>
              </div>
              <div className="flex-1 p-6 font-mono text-xs space-y-2 overflow-y-auto whitespace-pre-wrap">
                 {output.map((line, i) => (
                    <div key={i} className="flex gap-4">
                       <span className="text-zinc-700">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                       <span className={line.type === 'error' ? 'text-red-500' : line.type === 'success' ? 'text-emerald-500' : 'text-zinc-400'}>
                          {line.text}
                       </span>
                    </div>
                 ))}
                 <div className="pt-4 text-zinc-600 font-bold">&gt; _</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CodingAssess;
