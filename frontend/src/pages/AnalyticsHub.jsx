import React from 'react';
import { Box, Typography, Container, Grid, Paper, useTheme } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';

const mockPerformanceData = [
  { session: 'Oct 1', communication: 65, efficiency: 70 },
  { session: 'Oct 5', communication: 70, efficiency: 65 },
  { session: 'Oct 12', communication: 75, efficiency: 78 },
  { session: 'Oct 18', communication: 82, efficiency: 80 },
  { session: 'Oct 24', communication: 88, efficiency: 85 },
];

const mockTopicData = [
  { subject: 'Algorithms', A: 85, fullMark: 100 },
  { subject: 'Data Structures', A: 78, fullMark: 100 },
  { subject: 'System Design', A: 60, fullMark: 100 },
  { subject: 'Communication', A: 88, fullMark: 100 },
  { subject: 'Code Cleanliness', A: 92, fullMark: 100 },
];

const mockLanguageData = [
  { name: 'JavaScript', usage: 60 },
  { name: 'Python', usage: 25 },
  { name: 'Java', usage: 10 },
  { name: 'C++', usage: 5 },
];

export const AnalyticsHub = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="800">Analytics Hub</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Performance Over Time</Typography>
              <Box sx={{ height: 350, width: '100%', mt: 2 }}>
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
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Skill Breakdown</Typography>
              <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockTopicData}>
                    <PolarGrid stroke={theme.palette.divider} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: theme.palette.text.secondary }} />
                    <Radar name="Candidate" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Language Usage</Typography>
              <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={mockLanguageData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
                    <XAxis type="number" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: theme.palette.action.hover }}
                    />
                    <Bar dataKey="usage" name="Usage %" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
