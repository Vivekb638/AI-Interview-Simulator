import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        pt: 4,
        pb: 2,
        px: { xs: 2, sm: 4 },
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        color: 'text.secondary',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', fontSize: '0.75rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          © 2026 InterviewPro
        </Typography>
        <Link href="#" color="inherit" underline="hover">Privacy Policy</Link>
        <Link href="#" color="inherit" underline="hover">Terms of Service</Link>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box 
            sx={{ 
              width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981',
              boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                '70%': { transform: 'scale(1)', boxShadow: '0 0 0 6px rgba(16, 185, 129, 0)' },
                '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
              }
            }} 
          />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>All Systems Operational</Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>v1.2.0</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
