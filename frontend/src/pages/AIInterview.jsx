import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../services/apiClient';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  MessageSquare, 
  Shield, 
  Settings, 
  PhoneOff,
  Cpu,
  Brain,
  Terminal,
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const AIInterview = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('question');
  
  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const isMutedRef = useRef(isMuted);
  const [stream, setStream] = useState(null);

  const [transcript, setTranscript] = useState("Waiting for candidate to speak...");
  const [aiQuestion, setAiQuestion] = useState("Design a real-time collaborative dashboard using React and WebSockets.");
  const [aiAnalysis, setAiAnalysis] = useState({
    score: 84,
    confidence: 90,
    clarity: 75,
    sentiment: 85
  });

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Setup MediaRecorder for Audio transcription
        const audioTrack = mediaStream.getAudioTracks()[0];
        if (audioTrack) {
          const audioStream = new MediaStream([audioTrack]);
          mediaRecorder.current = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
          
          mediaRecorder.current.ondataavailable = async (e) => {
            if (e.data.size > 0 && !isMutedRef.current) {
              const formData = new FormData();
              formData.append('audio', e.data, 'chunk.webm');
              
              try {
                // Transcribe
                const transRes = await apiClient.post('/transcribe', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (transRes && transRes.text && transRes.text.trim() !== '') {
                  setTranscript(prev => prev === "Waiting for candidate to speak..." ? transRes.text : prev + ' ' + transRes.text);
                  
                  // Evaluate
                  const evalRes = await apiClient.post('/evaluate', {
                    transcript: transRes.text,
                    role: 'Frontend Engineer',
                    topic: 'Architecture'
                  });
                  
                  if (evalRes && evalRes.nextQuestion) {
                    setAiQuestion(evalRes.nextQuestion);
                    setAiAnalysis({
                      score: evalRes.score || 0,
                      confidence: evalRes.behavioral?.confidence || 0,
                      clarity: evalRes.behavioral?.clarity || 0,
                      sentiment: evalRes.behavioral?.sentiment || 0
                    });
                  }
                }
              } catch (err) {
                console.error("AI Pipeline Error:", err);
              }
            }
          };

          // Start recording chunks every 10 seconds
          mediaRecorder.current.start(10000);
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
      }
    };
    initCamera();
    
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      stream.getVideoTracks().forEach(t => t.enabled = isVideoOn);
    }
  }, [isMuted, isVideoOn, stream]);

  return (
    <div className="h-screen bg-[#050505] text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white fill-white" />
           </div>
           <div className="h-4 w-px bg-zinc-800 mx-1" />
           <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">AI Interview Room</p>
              <h2 className="text-sm font-bold text-white">Frontend Engineer Round</h2>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">REC LIVE</span>
           </div>
           <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">24:12</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <Badge variant="violet">AI Evaluator Active</Badge>
           <button className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Video Feeds */}
        <div className="flex-1 p-6 flex flex-col gap-6 relative">
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Candidate Video */}
              <div className="relative bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                 <video 
                   ref={videoRef}
                   autoPlay 
                   playsInline 
                   muted 
                   className={`w-full h-full object-cover transition-opacity duration-300 ${!isVideoOn ? 'opacity-0' : 'opacity-100'}`}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                 {!isVideoOn && (
                   <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                     <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                       <VideoOff className="w-8 h-8 text-zinc-500" />
                     </div>
                   </div>
                 )}
                 
                 <div className="absolute top-6 left-6 flex items-center gap-2">
                    <Badge variant="zinc">Candidate (You)</Badge>
                    {isMuted && <Badge variant="red" className="flex items-center gap-1"><MicOff className="w-3 h-3"/> Muted</Badge>}
                 </div>
                 <div className="absolute bottom-6 left-6">
                    <p className="text-white font-bold">Alex Johnson</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Live Stream Active</p>
                 </div>
                 {/* Visual AI Overlay Placeholder */}
                 <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                    <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Identity Verified</div>
                    <div className="px-2 py-1 bg-violet-500/20 border border-violet-500/30 rounded text-[8px] font-bold text-violet-500 uppercase tracking-tighter">Eye-contact: 92%</div>
                 </div>
              </div>

              {/* AI Interviewer Video */}
              <div className="relative bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl group">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-32 h-32 bg-violet-600/20 rounded-full flex items-center justify-center border border-violet-500/30 relative"
                    >
                       <Brain className="w-12 h-12 text-violet-500" />
                       <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
                    </motion.div>
                 </div>
                 <div className="absolute bottom-6 left-6">
                    <p className="text-white font-bold text-lg flex items-center gap-2">
                       Interview AI <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Autonomous Agent v2.4</p>
                 </div>
              </div>
           </div>

           {/* AI Transcript Bar */}
           <div className="h-24 glass rounded-2xl border-violet-500/20 p-4 flex items-center gap-6 overflow-hidden">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                 <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                 <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">Live Transcript</p>
                 <p className="text-zinc-300 font-medium line-clamp-2 italic">
                    "{transcript}"
                 </p>
              </div>
           </div>
        </div>

        {/* Right Side: Sidebar Panels */}
        <div className="w-96 border-l border-zinc-900 bg-zinc-950 flex flex-col">
           <div className="flex p-4 border-b border-zinc-900">
              <button 
                 onClick={() => setActiveTab('question')}
                 className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'question' ? 'bg-zinc-900 text-violet-500' : 'text-zinc-600'}`}
              >
                 Question
              </button>
              <button 
                 onClick={() => setActiveTab('analysis')}
                 className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'analysis' ? 'bg-zinc-900 text-violet-500' : 'text-zinc-600'}`}
              >
                 AI Analysis
              </button>
           </div>

           <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'question' ? (
                 <div className="space-y-6">
                     <Badge variant="violet">Topic: Architecture</Badge>
                     <h3 className="text-xl font-bold text-white leading-snug">{aiQuestion}</h3>
                     <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">AI Evaluator Ready</p>
                        <p className="text-sm text-zinc-400">Please speak your answer clearly into the microphone. The AI will evaluate your response every 10 seconds.</p>
                     </div>
                  </div>
              ) : (
                 <div className="space-y-6">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">Technical Score</p>
                        <div className="flex items-end gap-2">
                           <span className="text-4xl font-bold text-white">{aiAnalysis.score}</span>
                           <span className="text-zinc-500 pb-1 font-bold">/ 100</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Behavioral Traits</p>
                        {[
                           { label: 'Confidence', value: aiAnalysis.confidence },
                           { label: 'Clarity', value: aiAnalysis.clarity },
                           { label: 'Sentiment', value: aiAnalysis.sentiment },
                        ].map((trait, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-xs">
                                 <span className="text-zinc-400">{trait.label}</span>
                                 <span className="text-white font-bold">{trait.value}%</span>
                              </div>
                              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                 <div className="h-full bg-violet-500" style={{ width: `${trait.value}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                 </div>
              )}
           </div>

           {/* Quick Actions */}
           <div className="p-6 border-t border-zinc-900 grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 text-zinc-500 transition-all">
                 <Terminal className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase">Code</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 text-zinc-500 transition-all">
                 <Shield className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase">Security</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-red-500/10 rounded-xl hover:bg-red-500 text-red-500 hover:text-white transition-all">
                 <PhoneOff className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase">End</span>
              </button>
           </div>
        </div>
      </div>

      {/* Control Bar (Floating) */}
      <div className="h-20 bg-[#050505] border-t border-zinc-900 flex items-center justify-center gap-6">
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
         >
            {isMuted ? <MicOff /> : <Mic />}
         </button>
         <button 
           onClick={() => setIsVideoOn(!isVideoOn)}
           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
         >
            {!isVideoOn ? <VideoOff /> : <VideoIcon />}
         </button>
         <div className="w-px h-6 bg-zinc-800 mx-2" />
         <button className="w-12 h-12 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all">
            <Settings />
         </button>
         <Button className="px-8 bg-red-600 hover:bg-red-700 shadow-red-500/20">End Session</Button>
      </div>
    </div>
  );
};

export default AIInterview;
