import React from 'react';
import { Box, Typography, Paper, Divider, Button, List, ListItem, ListItemText, ListItemIcon, Container, Grid } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import Editor from '@monaco-editor/react';

const MOCK_DATA_RADAR = [
  { subject: 'Algorithmic Efficiency', A: 85, fullMark: 100 },
  { subject: 'Communication Skills', A: 90, fullMark: 100 },
  { subject: 'Code Cleanliness', A: 70, fullMark: 100 },
  { subject: 'System Design', A: 65, fullMark: 100 },
  { subject: 'Problem Solving', A: 88, fullMark: 100 },
  { subject: 'Debugging', A: 75, fullMark: 100 },
];

const MOCK_TIMELINE_DATA = [
  { time: '0:00', event: 'Interview Started', type: 'info' },
  { time: '5:12', event: 'Completed Technical Phase (Score 8/10)', type: 'success' },
  { time: '12:04', event: 'Tab Switch Detected (Proctoring)', type: 'warning' },
  { time: '18:30', event: 'Completed Bug Fix Phase (Score 7/10)', type: 'success' },
  { time: '22:15', event: 'Pasted large block of code (Proctoring)', type: 'warning' },
  { time: '28:45', event: 'Completed Behavioral Phase (Confidence 9/10)', type: 'success' },
];

const mockCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`;

const mockTranscript = [
  { role: 'AI', text: "Welcome to the interview. Let's start with a coding problem: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
  { role: 'Candidate', text: "Sure. I can solve this using a hash map to store the elements I've seen so far and their indices. This will allow for O(1) lookups." },
  { role: 'AI', text: "That sounds like a solid approach. What would be the overall time and space complexity of your solution?" },
  { role: 'Candidate', text: "The time complexity will be O(N) because we iterate through the array once. The space complexity will also be O(N) in the worst case, as we might store all elements in the hash map." },
  { role: 'AI', text: "Excellent. Please go ahead and write the code." }
];

export const Report = () => {
  const { id } = useParams();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="text.primary">Session Report</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{id || 'INT-A1B2C3'}</Typography>
          </Box>
          <Button component={Link} to="/history" variant="outlined" sx={{ borderRadius: 2 }}>Back to History</Button>
        </Box>

        <Grid container spacing={4}>
          {/* Top Row: Radar & Overall Feedback */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <Typography variant="h6" gutterBottom fontWeight="700">Skill Assessment Matrix</Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={MOCK_DATA_RADAR}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar name="Candidate" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Paper sx={{ p: 4, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <Typography variant="h6" gutterBottom fontWeight="700">AI Feedback Summary</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" color="success.main" fontWeight="bold" gutterBottom>Strengths</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The candidate quickly identified the optimal O(N) solution using a Hash Map. Excellent communication of trade-offs between time and space complexity before writing code. Code was clean and variable names were descriptive.
              </Typography>

              <Typography variant="subtitle1" color="warning.main" fontWeight="bold" gutterBottom>Areas for Improvement</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Consider discussing edge cases explicitly before coding (e.g., what if the array is empty, or what if no solution exists, even though the prompt guarantees one).
              </Typography>

              <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(79, 70, 229, 0.05)', borderRadius: 2, border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>Hidden Test Cases Passed</Typography>
                <Typography variant="h4" color="text.primary">5 / 5</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Bottom Row: Code Snapshot & Transcript */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ height: '500px', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: '#2d2d2d', borderBottom: '1px solid #404040' }}>
                <Typography variant="subtitle2" color="white" fontWeight="bold">Final Code Submission</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={mockCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    padding: { top: 16 }
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper sx={{ height: '500px', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" fontWeight="bold">Interview Transcript</Typography>
              </Box>
              <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
                {mockTranscript.map((msg, idx) => (
                  <Box key={idx} sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'Candidate' ? 'flex-end' : 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{msg.role}</Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      maxWidth: '80%',
                      bgcolor: msg.role === 'Candidate' ? 'primary.main' : 'background.default',
                      color: msg.role === 'Candidate' ? 'primary.contrastText' : 'text.primary',
                      border: msg.role === 'AI' ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
