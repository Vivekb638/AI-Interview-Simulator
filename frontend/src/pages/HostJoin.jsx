import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PeopleIcon from '@mui/icons-material/People';

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'INT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const HostJoin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isHosting, setIsHosting] = useState(false);

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

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="800">Host or Join Session</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>Host a Live Interview</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                Generate a secure, unique room code to interview a candidate. The room includes a shared code editor and video feed.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                fullWidth 
                onClick={handleHostRoom} 
                disabled={isHosting} 
                startIcon={<AddLinkRoundedIcon />}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Generate Room Link
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>Join a Session</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                Enter the 6-digit code provided by your recruiter or interviewer to enter the secure environment.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  placeholder="e.g. INT-A1B2" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.default' } }}
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={handleJoinRoom} 
                  sx={{ borderRadius: 2, px: 3, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.secondary' } }}
                >
                  <KeyboardArrowRightRoundedIcon />
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
