import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const PagePlaceholder = ({ title, description }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom fontWeight="bold">{title}</Typography>
    <Paper sx={{ p: 4, mt: 2, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', bgcolor: 'background.default' }} elevation={0}>
      <Typography variant="h6">{description}</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>This page is currently under construction.</Typography>
    </Paper>
  </Box>
);

export const Practice = () => <PagePlaceholder title="AI Practice" description="Start an autonomous AI interview session here." />;
export const QuestionBank = () => <PagePlaceholder title="Question Bank" description="Manage coding questions and test cases here." />;
export const HostJoin = () => <PagePlaceholder title="Host / Join Session" description="Create a new live room or join an existing one." />;
export const History = () => <PagePlaceholder title="History & Reports" description="View past interview sessions and performance analytics." />;
export const Settings = () => <PagePlaceholder title="Settings" description="Manage your profile and application preferences." />;
export const AnalyticsHub = () => <PagePlaceholder title="Analytics Hub" description="Deep-dive visualizations of your historical performance." />;
export const Support = () => <PagePlaceholder title="Support & Contact" description="Report bugs or contact the admin team." />;
