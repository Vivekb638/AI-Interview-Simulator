import React from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const mockQuestions = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', timesUsed: 45 },
  { id: 2, title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', timesUsed: 32 },
  { id: 3, title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked Lists', timesUsed: 18 },
  { id: 4, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stacks', timesUsed: 50 },
  { id: 5, title: 'Word Search II', difficulty: 'Hard', topic: 'Trie', timesUsed: 12 },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'success';
    case 'Medium': return 'warning';
    case 'Hard': return 'error';
    default: return 'default';
  }
};

export const QuestionBank = () => {
  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <FolderIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="800">Question Bank</Typography>
        </Box>

        <Paper sx={{ width: '100%', mb: 2, borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="question bank table">
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Difficulty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Topic</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Times Used</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockQuestions.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell component="th" scope="row">#{row.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.title}</TableCell>
                    <TableCell>
                      <Chip label={row.difficulty} size="small" color={getDifficultyColor(row.difficulty)} sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>{row.topic}</TableCell>
                    <TableCell align="right">{row.timesUsed}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small"><PlayArrowIcon /></IconButton>
                      <IconButton color="secondary" size="small"><EditIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};
