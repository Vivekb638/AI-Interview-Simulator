import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Chip, Divider } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const INTERVIEW_QUESTIONS = [
  {
    title: "Two Sum",
    description: "Write a function to return the indices of the two numbers in an array that add up to a specific target.",
    inputFormat: "An array of integers `nums` and an integer `target`.",
    outputFormat: "An array containing the two indices.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    examples: [
      { in: "nums = [2,7,11,15], target = 9", out: "[0,1]" },
      { in: "nums = [3,2,4], target = 6", out: "[1,2]" }
    ]
  },
  {
    title: "Valid Palindrome",
    description: "Write an algorithm to determine if a given string is a valid palindrome, ignoring non-alphanumeric characters.",
    inputFormat: "A single string `s`.",
    outputFormat: "A boolean: `true` or `false`.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    examples: [
      { in: "s = 'A man, a plan, a canal: Panama'", out: "true" },
      { in: "s = 'race a car'", out: "false" }
    ]
  }
];

const BUGGY_QUESTIONS = [
  {
    title: "Read the Code: Find the Bug",
    description: "The following JavaScript code is supposed to calculate the factorial of a number, but it contains a bug. Explain what the bug is and how to fix it.",
    codeSnippet: "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n);\n}"
  }
];

const BEHAVIORAL_QUESTIONS = [
  {
    title: "Behavioral: Conflict Resolution",
    description: "Tell me about a time you had a disagreement with a team member. How did you resolve it? Please use the STAR method (Situation, Task, Action, Result)."
  }
];

const AIFeedback = ({ currentCode, track = 'General', diff = 'Mid-Level' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [phase, setPhase] = useState('technical');
  
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    loadQuestionForPhase('technical');
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const loadQuestionForPhase = (newPhase) => {
    let qList = INTERVIEW_QUESTIONS;
    if (newPhase === 'read-code') qList = BUGGY_QUESTIONS;
    if (newPhase === 'behavioral') qList = BEHAVIORAL_QUESTIONS;
    
    setActiveQuestion(qList[Math.floor(Math.random() * qList.length)]);
    setEvaluation(null);
    setTranscription('');
  };

  const advancePhase = () => {
    let nextPhase = 'finished';
    if (phase === 'technical') nextPhase = 'read-code';
    else if (phase === 'read-code') nextPhase = 'behavioral';
    
    setPhase(nextPhase);
    if (nextPhase !== 'finished') {
      loadQuestionForPhase(nextPhase);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm' };
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      // Extract WS URL correctly
      let wsUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      wsUrl = wsUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      wsRef.current = new WebSocket(`${wsUrl}/ws/transcribe`);

      wsRef.current.onopen = () => {
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0 && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start(1000); // 1-second chunks
        setIsRecording(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.text !== undefined) setTranscription(data.text);
          if (data.error) console.error("WS Error:", data.error);
        } catch (e) {
          console.error("WS Message Error:", e);
        } finally {
          setIsProcessing(false);
          if (wsRef.current) wsRef.current.close();
        }
      };

    } catch (err) {
      console.error("Microphone access denied:", err);
      setTranscription("Microphone access was denied or not found.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true); // Wait for transcription response
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ text: "STOP" }));
      }
    }
  };

  const requestEvaluation = async () => {
    setIsProcessing(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/evaluate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Internal-Secret': 'dev_secret_key'
        },
        body: JSON.stringify({ 
          code: currentCode, 
          question: activeQuestion, 
          spokenAnswer: transcription,
          phase: phase,
          track: track,
          difficulty: diff
        })
      });
      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        <AssessmentIcon color="primary" /> AI Interviewer ({phase.toUpperCase()})
      </Typography>

      {phase === 'finished' ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6">Interview Complete!</Typography>
          <Typography variant="body2" color="text.secondary">Thank you for your time. The team will review your results.</Typography>
        </Box>
      ) : activeQuestion && (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, borderLeft: '4px solid', borderLeftColor: 'primary.light' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{activeQuestion.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{activeQuestion.description}</Typography>
          
          {activeQuestion.timeComplexity && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip size="small" label={`Time: ${activeQuestion.timeComplexity}`} color="info" variant="outlined" />
              <Chip size="small" label={`Space: ${activeQuestion.spaceComplexity}`} color="warning" variant="outlined" />
            </Box>
          )}
          
          {activeQuestion.inputFormat && (
            <>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}><b>Input:</b> {activeQuestion.inputFormat}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}><b>Output:</b> {activeQuestion.outputFormat}</Typography>
              
              <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                {activeQuestion.examples.map((ex, i) => (
                  <Typography key={i} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', color: 'success.main' }}>
                    Test {i+1}: {ex.in} ➞ {ex.out}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          {activeQuestion.codeSnippet && (
            <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, mt: 1, overflowX: 'auto', border: 1, borderColor: 'divider' }}>
              <pre style={{ margin: 0 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'warning.main' }}>
                  {activeQuestion.codeSnippet}
                </Typography>
              </pre>
            </Box>
          )}
        </Box>
      )}

      {phase !== 'finished' && (
        <>
          <Box sx={{ p: 2, border: '1px solid #333', borderRadius: 1, minHeight: '80px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>Your Spoken Answer:</Typography>
            <Typography variant="body2" sx={{ fontStyle: transcription ? 'normal' : 'italic', color: transcription ? 'white' : '#666' }}>
              {transcription || "Record your verbal explanation of the code..."}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isRecording ? (
              <Button variant="contained" color="error" fullWidth startIcon={<StopIcon />} onClick={stopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button variant="outlined" color="primary" fullWidth startIcon={<MicIcon />} onClick={startRecording} disabled={isProcessing}>
                Explain Code
              </Button>
            )}
            <Button variant="contained" color="success" fullWidth onClick={requestEvaluation} disabled={isProcessing || isRecording}>
              {isProcessing && !isRecording ? <CircularProgress size={20} color="inherit" /> : 'Submit & Test'}
            </Button>
          </Box>
        </>
      )}

      {evaluation && phase !== 'finished' && (
        <Box sx={{ mt: 1 }}>
          <Divider sx={{ mb: 2 }} />
          
          {evaluation.hiddenTestCases && evaluation.hiddenTestCases.length > 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Hidden Test Cases ({evaluation.hiddenTestCases.length})</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                {evaluation.hiddenTestCases.map((tc, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip 
                      icon={tc.passed ? <CheckCircleIcon /> : <CancelIcon />} 
                      label={tc.name || `Case ${idx+1}`} 
                      color={tc.passed ? "success" : "error"} 
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '120px' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {tc.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
             <Typography variant="subtitle1" fontWeight="bold">AI Review</Typography>
             <Chip label={`Score: ${evaluation.score}/10`} color={evaluation.score >= 7 ? "success" : "warning"} />
          </Box>
          <Typography variant="body2" paragraph>{evaluation.feedback}</Typography>
          
          <Typography variant="caption" fontWeight="bold" color="success.main">Strengths:</Typography>
          <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
            {evaluation.strengths?.map((str, i) => <li key={i}><Typography variant="body2">{str}</Typography></li>)}
          </ul>

          <Typography variant="caption" fontWeight="bold" color="error.main">Areas for Improvement:</Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {evaluation.improvements?.map((imp, i) => <li key={i}><Typography variant="body2">{imp}</Typography></li>)}
          </ul>

          {evaluation.communicationConfidence !== undefined && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(237, 108, 2, 0.1)', borderRadius: 1, border: 1, borderColor: 'warning.main' }}>
              <Typography variant="caption" color="warning.main">Communication Confidence Score: {evaluation.communicationConfidence}/10</Typography>
            </Box>
          )}

          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ mt: 3 }}
            onClick={advancePhase}
          >
            Advance to Next Round
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AIFeedback;
