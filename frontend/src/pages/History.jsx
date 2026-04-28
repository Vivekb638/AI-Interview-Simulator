import React, { useState } from 'react';
import { Box, Typography, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const mockSessions = [
  { id: 'INT-A1B2C3', date: 'Oct 24, 2026', time: '14:30', type: 'AI Simulator', role: 'Candidate', track: 'Frontend React', score: 8.5 },
  { id: 'INT-X9Y8Z7', date: 'Oct 22, 2026', time: '09:00', type: 'Collaborative', role: 'Interviewer', track: 'General Algorithm', score: 7.0 },
  { id: 'INT-M4N5P6', date: 'Oct 15, 2026', time: '16:45', type: 'AI Simulator', role: 'Candidate', track: 'Backend Python', score: 9.2 },
  { id: 'INT-Q1W2E3', date: 'Oct 10, 2026', time: '11:15', type: 'Collaborative', role: 'Candidate', track: 'System Design', score: 6.8 },
];

export const History = () => {
  const [filterType, setFilterType] = useState('All');
  const [filterRole, setFilterRole] = useState('All');

  const filteredSessions = mockSessions.filter(s => {
    if (filterType !== 'All' && s.type !== filterType) return false;
    if (filterRole !== 'All' && s.role !== filterRole) return false;
    return true;
  });

  return (
    <Box sx={{ minHeight: '100vh', pt: 2, pb: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="800" color="text.primary" gutterBottom>Session History</Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Review your past interview sessions and access detailed analytics reports.
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Typography fontWeight="bold" sx={{ mr: 2 }}>Filters:</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="AI Simulator">AI Simulator</MenuItem>
              <MenuItem value="Collaborative">Collaborative</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select value={filterRole} label="Role" onChange={(e) => setFilterRole(e.target.value)}>
              <MenuItem value="All">All Roles</MenuItem>
              <MenuItem value="Candidate">Candidate</MenuItem>
              <MenuItem value="Interviewer">Interviewer</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Data Table */}
        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Session ID</TableCell>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Track</TableCell>
                <TableCell sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Score</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id} sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: 'background.default' } }}>
                  <TableCell sx={{ color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight="500">{session.date}</Typography>
                    <Typography variant="caption" color="text.secondary">{session.time}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: 'divider', fontFamily: 'monospace', color: 'text.secondary' }}>{session.id}</TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Chip 
                      label={session.type} 
                      size="small" 
                      sx={{ 
                        bgcolor: session.type === 'AI Simulator' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(217, 119, 6, 0.1)', 
                        color: session.type === 'AI Simulator' ? '#4F46E5' : '#d97706',
                        fontWeight: '600',
                        borderRadius: '12px'
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: 'divider', color: 'text.secondary' }}>{session.role}</TableCell>
                  <TableCell sx={{ color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>{session.track}</TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Typography fontWeight="bold" color={session.score >= 8 ? 'success.main' : (session.score >= 6 ? 'warning.main' : 'error.main')}>
                      {session.score}/10
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Button size="small" component={Link} to={`/report/${session.id}`} color="primary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>View Report</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No sessions found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
};
