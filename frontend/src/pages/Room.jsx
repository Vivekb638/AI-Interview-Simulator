import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, CircularProgress, Alert, Paper, Drawer, IconButton, useTheme } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CodeEditor from '../components/CodeEditor';
import AIFeedback from '../components/AIFeedback';
import HostPanel from '../components/HostPanel';
import VideoChat from '../components/VideoChat';
import Chat from '../components/Chat';
import PromptPanel from '../components/room/PromptPanel';

export const Room = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const [currentCode, setCurrentCode] = useState('');
  const [hostDrawerOpen, setHostDrawerOpen] = useState(false);
  
  // Session Validation State
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isAiSolo = id === 'ai-solo';
  const searchParams = new URLSearchParams(location.search);
  const track = searchParams.get('track') || 'General';
  const diff = searchParams.get('diff') || 'Mid-Level';

  useEffect(() => {
    if (isAiSolo) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      const { data, error } = await supabase.from('sessions').select('*').eq('room_code', id).single();
      if (error || !data) {
        setErrorMsg('Room not found or has been closed.');
      } else {
        setSession(data);
      }
      setLoading(false);
    };

    fetchSession();

    const channel = supabase.channel(`room-status-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `room_code=eq.${id}` }, 
        (payload) => {
          setSession(payload.new);
        }
      )
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (errorMsg) return <Container sx={{ mt: 10 }}><Alert severity="error">{errorMsg}</Alert></Container>;

  const role = isAiSolo ? 'Candidate' : (user?.id === session?.host_id ? 'Interviewer' : 'Candidate');

  // Waiting Room Logic
  if (!isAiSolo && session?.status === 'waiting') {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Room {id}</Typography>
          {role === 'Interviewer' ? (
            <>
              <Typography color="text.secondary" paragraph>
                The room is currently locked. The candidate will see a waiting screen until you admit them.
              </Typography>
              <Button 
                variant="contained" 
                color="success" 
                size="large"
                onClick={async () => {
                  setSession(prev => ({ ...prev, status: 'active' }));
                  const { error } = await supabase.from('sessions').update({ status: 'active' }).eq('room_code', id);
                  if (error) {
                    console.error("Failed to update status:", error);
                    setSession(prev => ({ ...prev, status: 'waiting' }));
                    alert("Failed to admit candidate. Check console for error.");
                  }
                }}
              >
                Admit Candidate & Start Interview
              </Button>
            </>
          ) : (
            <>
              <Typography color="text.secondary" paragraph>
                Please wait. Your Interviewer will admit you to the live session shortly.
              </Typography>
              <CircularProgress sx={{ mt: 2 }} />
            </>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
      
      {/* Top Bar for Room (Minimal) */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', zIndex: 10 }}>
        <Typography variant="subtitle2" fontWeight="bold">Room: {id}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {role === 'Interviewer' && (
            <Button size="small" variant="outlined" startIcon={<MenuOpenIcon />} onClick={() => setHostDrawerOpen(true)}>
              Host Panel
            </Button>
          )}
          <Button size="small" color="error" variant="contained">Leave Room</Button>
        </Box>
      </Box>

      {/* Main 3-Pane Layout (Starts below top bar) */}
      <Box sx={{ display: 'flex', width: '100%', pt: '48px' }}>
        
        {/* Left Panel: Prompt (25%) */}
        <Box sx={{ width: '25%', minWidth: 300, borderRight: 1, borderColor: 'divider', p: 1 }}>
          <PromptPanel />
        </Box>

        {/* Center Panel: Editor (50%) */}
        <Box sx={{ flexGrow: 1, width: '50%', borderRight: 1, borderColor: 'divider', p: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
            <CodeEditor roomId={id} onCodeChange={setCurrentCode} role={role} />
          </Box>
        </Box>

        {/* Right Panel: Communication & AI (25%) */}
        <Box sx={{ width: '25%', minWidth: 300, p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isAiSolo ? (
            <Box sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
               <AIFeedback currentCode={currentCode} track={track} diff={diff} />
            </Box>
          ) : (
            <>
              <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <VideoChat roomId={id} />
              </Box>
              <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Chat roomId={id} />
              </Box>
            </>
          )}
        </Box>

      </Box>

      {/* Host Drawer */}
      <Drawer anchor="right" open={hostDrawerOpen} onClose={() => setHostDrawerOpen(false)} PaperProps={{ sx: { width: 400, bgcolor: 'background.paper' } }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Interviewer Tools</Typography>
          <Button onClick={() => setHostDrawerOpen(false)}>Close</Button>
        </Box>
        <Box sx={{ p: 2 }}>
          <HostPanel roomId={id} />
        </Box>
      </Drawer>
    </Box>
  );
};
