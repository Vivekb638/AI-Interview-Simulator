import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, Tab, Tabs } from '@mui/material';

const mockProblem = {
  title: 'Two Sum',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table'],
  description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ]
};

const PromptPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="fullWidth">
          <Tab label="Problem" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
          <Tab label="Submissions" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>{mockProblem.title}</Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={mockProblem.difficulty} size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 'bold' }} />
            {mockProblem.tags.map(tag => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
            ))}
          </Box>

          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.primary' }}>
            {mockProblem.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {mockProblem.examples.map((ex, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Example {idx + 1}:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.9rem' }} elevation={0}>
                <Box sx={{ display: 'flex' }}><strong style={{ width: '80px', color: '#8b5cf6' }}>Input:</strong> <span>{ex.input}</span></Box>
                <Box sx={{ display: 'flex', mt: 1 }}><strong style={{ width: '80px', color: '#8b5cf6' }}>Output:</strong> <span>{ex.output}</span></Box>
                {ex.explanation && (
                  <Box sx={{ display: 'flex', mt: 1 }}><strong style={{ width: '80px', color: '#64748b' }}>Explain:</strong> <span style={{ color: '#64748b' }}>{ex.explanation}</span></Box>
                )}
              </Paper>
            </Box>
          ))}

          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Constraints:</Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {mockProblem.constraints.map((c, idx) => (
              <Typography component="li" variant="body2" key={idx} sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'background.default', display: 'inline-block', p: 0.5, borderRadius: 1 }}>
                {c}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography color="text.secondary">No submissions yet.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PromptPanel;
