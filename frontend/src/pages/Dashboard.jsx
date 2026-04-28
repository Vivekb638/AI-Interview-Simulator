import React, { useState } from 'react';
import { Box, Typography, Button, Container, TextField, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Avatar, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import RestoreIcon from '@mui/icons-material/Restore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const mockPerformanceData = [
  { session: 'Oct 1', communication: 65, efficiency: 70 },
  { session: 'Oct 5', communication: 70, efficiency: 65 },
  { session: 'Oct 12', communication: 75, efficiency: 78 },
  { session: 'Oct 18', communication: 82, efficiency: 80 },
  { session: 'Oct 24', communication: 88, efficiency: 85 },
];

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'INT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [joinCode, setJoinCode] = useState('');
  const [isHosting, setIsHosting] = useState(false);

  const [track, setTrack] = useState('Algorithmic Problem Solving');
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  
  const hasUnfinishedSession = true; // Mock state for Quick Resume

  const handleHostRoom = async () => {
    setIsHosting(true);
    const newCode = generateRoomCode();
    
    const { error } = await supabase.from('sessions').insert([{
      room_code: newCode,
      host_id: user.id,
      status: 'waiting'
    }]);

    setIsHosting(false);

    if (!error) {
      navigate(`/room/${newCode}`);
    } else {
      alert(`Failed to create room: ${error.message}`);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode) return;
    const { data, error } = await supabase.from('sessions').select('*').eq('room_code', joinCode).single();
    if (!error && data) {
      navigate(`/room/${joinCode}`);
    } else {
      alert('Invalid Room Code or Room does not exist.');
    }
  };

  const startAiPractice = () => {
    navigate(`/room/ai-solo?track=${encodeURIComponent(track)}&lang=${encodeURIComponent(language)}&diff=${encodeURIComponent(difficulty)}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Row 1: Hero Welcome Area */}
        <Paper 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            mb: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              {hasUnfinishedSession ? "You have an unfinished mock interview." : `Welcome back, ${user?.email?.split('@')[0] || 'Developer'}.`}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mb: hasUnfinishedSession ? 3 : 0 }}>
              {hasUnfinishedSession ? "Resume your session to complete the evaluation and get your AI feedback report." : "Your coding efficiency is up 12% this week. Keep up the momentum!"}
            </Typography>
            {hasUnfinishedSession && (
              <Button variant="contained" color="primary" startIcon={<RestoreIcon />} sx={{ borderRadius: 2, px: 3, py: 1, bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338ca' } }}>
                Resume Session INT-M4N5
              </Button>
            )}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', zIndex: 2 }}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <CodeRoundedIcon sx={{ fontSize: 60, color: '#a5b4fc' }} />
            </Avatar>
          </Box>
          {/* Decorative background circle */}
          <Box sx={{ position: 'absolute', right: -50, top: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 70%)', zIndex: 1 }} />
        </Paper>

        {/* Row 2: Core Actions (Bento Grid) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Left Box (60%) */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 0 0 1px rgba(79, 70, 229, 0.1), 0 10px 30px -10px rgba(79, 70, 229, 0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="800" gutterBottom>Start AI Simulator</Typography>
                <Typography variant="body2" color="text.secondary">
                  Launch a high-fidelity mock interview tailored to specific domains.
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Specialized Track</InputLabel>
                    <Select value={track} label="Specialized Track" onChange={(e) => setTrack(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="Algorithmic Problem Solving">Algorithmic Problem Solving</MenuItem>
                      <MenuItem value="Theoretical CS & System Design">Theoretical CS & System Design</MenuItem>
                      <MenuItem value="Data Science & Analytics">Data Science & Analytics</MenuItem>
                      <MenuItem value="Frontend Architecture">Frontend Architecture</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="javascript">JavaScript / Node.js</MenuItem>
                      <MenuItem value="python">Python</MenuItem>
                      <MenuItem value="java">Java</MenuItem>
                      <MenuItem value="cpp">C++</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Difficulty</InputLabel>
                    <Select value={difficulty} label="Difficulty" onChange={(e) => setDifficulty(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="Junior">Junior</MenuItem>
                      <MenuItem value="Mid-Level">Mid-Level</MenuItem>
                      <MenuItem value="Senior">Senior</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth 
                onClick={startAiPractice}
                endIcon={<PlayArrowRoundedIcon />}
                sx={{ 
                  borderRadius: 2, 
                  py: 1.5, 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                  '&:hover': { background: 'linear-gradient(to right, #4338ca, #6d28d9)', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)' }
                }}
              >
                Launch Interview
              </Button>
            </Paper>
          </Grid>

          {/* Right Box (40%) Stacked */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              
              {/* Host Session */}
              <Paper sx={{ p: 3, flex: 1, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Host Live Session</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Generate a secure room code to interview a candidate.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleHostRoom} 
                  disabled={isHosting} 
                  startIcon={<AddLinkRoundedIcon />}
                  sx={{ borderRadius: 2, py: 1, fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                >
                  Generate Room Link
                </Button>
              </Paper>

              {/* Join Session */}
              <Paper sx={{ p: 3, flex: 1, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Join Session</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter the 6-digit code provided by your recruiter.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField 
                    size="small" 
                    placeholder="e.g. INT-A1B2" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.default' } }}
                  />
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={handleJoinRoom} 
                    sx={{ borderRadius: 2, minWidth: '48px', px: 0, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.secondary' } }}
                  >
                    <KeyboardArrowRightRoundedIcon />
                  </Button>
                </Box>
              </Paper>

            </Box>
          </Grid>
        </Grid>

        {/* Row 3: At a Glance Data */}
        <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Performance Trajectory</Typography>
            <Button component={Link} to="/analytics-hub" size="small" sx={{ fontWeight: 'bold' }}>View Detailed Analytics</Button>
          </Box>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={mockPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="session" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="communication" name="Communication Score" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="efficiency" name="Code Efficiency" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

      </Container>
    </Box>
  );
};
