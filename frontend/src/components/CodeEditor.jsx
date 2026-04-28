import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel, Paper, Alert, useTheme } from '@mui/material';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CodeEditor = ({ roomId, onCodeChange, role }) => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [channel, setChannel] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const editorRef = useRef(null);
  const decorationsRef = useRef(null);

  useEffect(() => {
    // Initial pass-up if parent tracks it
    if (onCodeChange) onCodeChange(code);

    const roomChannel = supabase.channel(`code:${roomId}`, {
      config: { broadcast: { ack: false } }
    });

    roomChannel
      .on('broadcast', { event: 'code-change' }, (payload) => {
        if (payload.payload.sender !== user?.email) {
          setCode(payload.payload.code);
          setLanguage(payload.payload.language || 'javascript');
          if (onCodeChange) onCodeChange(payload.payload.code);
        }
      })
      .on('broadcast', { event: 'editor-lock' }, (payload) => {
        setIsLocked(payload.payload.locked);
      })
      .on('broadcast', { event: 'cursor-change' }, (payload) => {
        if (payload.payload.sender !== user?.email && editorRef.current && decorationsRef.current) {
          const { position, sender } = payload.payload;
          const name = sender ? sender.split('@')[0] : 'User';
          
          decorationsRef.current.set([{
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            options: {
              className: 'remote-cursor',
              hoverMessage: { value: `**${name}**` }
            }
          }]);
        }
      })
      .subscribe();
      
    setChannel(roomChannel);

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleCheatWarning('Tab switched or minimized');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleCheatWarning = (reason) => {
    const newWarning = { reason, timestamp: new Date().toLocaleTimeString() };
    setWarnings(prev => [...prev, newWarning]);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'cheat-warning',
        payload: { user: user?.email, reason }
      });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection();

    editor.onDidPaste(() => {
      handleCheatWarning('Pasted code into editor');
    });

    editor.onDidChangeCursorPosition((e) => {
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'cursor-change',
          payload: { 
            sender: user?.email, 
            position: e.position 
          }
        });
      }
    });
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (onCodeChange) onCodeChange(value);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'code-change',
          payload: { code: value, language, sender: user?.email }
        });
      }
    }, 300);
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin: customInput })
      });
      
      const data = await response.json();
      if (data.error) {
        setOutput(`Error: ${data.error}\n${data.details || ''}`);
      } else {
        const result = data.stdout || data.stderr || data.compile_output || 'Program ran successfully without output.';
        setOutput(result);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Failed to execute code: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Collaborative Editor</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small">
            <Select
              value={language}
              onChange={(e) => {
                  setLanguage(e.target.value);
                  if (channel) channel.send({ 
                      type: 'broadcast', 
                      event: 'code-change', 
                      payload: { code, language: e.target.value, sender: user?.email } 
                  });
              }}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleExecute} 
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </Box>
      </Box>

      {warnings.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Alert severity="warning" onClose={() => setWarnings([])}>
            {warnings.length} Proctoring Flag(s): Last violation was "{warnings[warnings.length - 1].reason}" at {warnings[warnings.length - 1].timestamp}
          </Alert>
        </Box>
      )}
      
      <Box sx={{ flex: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            readOnly: isLocked && role === 'Candidate'
          }}
        />
      </Box>
      
      {/* Console and Input Panel */}
      <Box sx={{ height: '30%', display: 'flex', gap: 2, mt: 2 }}>
        <Paper sx={{ flex: 1, bgcolor: 'background.paper', p: 1, display: 'flex', flexDirection: 'column', border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Custom Input (STDIN):</Typography>
          <Box
            component="textarea"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type input here..."
            sx={{
              flex: 1,
              bgcolor: 'background.default',
              color: 'text.primary',
              p: 1,
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'none',
              borderRadius: 1
            }}
          />
        </Paper>
        <Paper sx={{ flex: 1, bgcolor: 'background.paper', p: 1, display: 'flex', flexDirection: 'column', border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Console Output:</Typography>
          <Box sx={{ flex: 1, bgcolor: 'background.default', color: theme.palette.mode === 'dark' ? '#a5d6a7' : '#1b5e20', p: 1, overflowY: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap', borderRadius: 1 }}>
            {output}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CodeEditor;
