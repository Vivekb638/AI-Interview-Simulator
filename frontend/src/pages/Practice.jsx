import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const Practice = () => {
  const navigate = useNavigate();
  const [track, setTrack] = useState('Algorithmic Problem Solving');
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [duration, setDuration] = useState('45');

  const startAiPractice = () => {
    navigate(`/room/ai-solo?track=${encodeURIComponent(track)}&lang=${encodeURIComponent(language)}&diff=${encodeURIComponent(difficulty)}&dur=${encodeURIComponent(duration)}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="800">AI Practice Simulator</Typography>
        </Box>
        
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Configure Your Session</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Tailor the AI interviewer to test specific skills. The AI will adapt to your responses in real-time.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel>Language Environment</InputLabel>
                <Select value={language} label="Language Environment" onChange={(e) => setLanguage(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="javascript">JavaScript / Node.js</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select value={difficulty} label="Difficulty Level" onChange={(e) => setDifficulty(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Mid-Level">Mid-Level</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Duration (Minutes)</InputLabel>
                <Select value={duration} label="Duration (Minutes)" onChange={(e) => setDuration(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="15">15 Minutes (Quick Screen)</MenuItem>
                  <MenuItem value="30">30 Minutes (Standard)</MenuItem>
                  <MenuItem value="45">45 Minutes (Deep Dive)</MenuItem>
                  <MenuItem value="60">60 Minutes (Comprehensive)</MenuItem>
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
              py: 2, 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #059669, #047857)',
              '&:hover': { background: 'linear-gradient(to right, #047857, #064e3b)' }
            }}
          >
            Launch Interview Session
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
