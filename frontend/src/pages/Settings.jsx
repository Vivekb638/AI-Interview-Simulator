import React, { useState, useContext } from 'react';
import { Box, Typography, Paper, Divider, Button, TextField, Container, Tabs, Tab, Avatar, Switch, FormControlLabel } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ColorModeContext } from '../App';
import { useTheme } from '@mui/material/styles';

export const Settings = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 2, pb: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight="800" color="text.primary" gutterBottom>Settings</Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Manage your account profile and application preferences.
        </Typography>

        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ px: 2 }}>
              <Tab label="Profile" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
              <Tab label="Preferences" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          {tabIndex === 0 && (
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                <Avatar sx={{ width: 100, height: 100, fontSize: '3rem', bgcolor: 'primary.main' }}>
                  {user?.email?.[0].toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Button variant="outlined" size="small" sx={{ mb: 1, borderRadius: 2 }}>Change Avatar</Button>
                  <Typography variant="caption" display="block" color="text.secondary">JPG, GIF or PNG. Max size of 800K</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '500px' }}>
                <TextField label="Display Name" variant="outlined" defaultValue={user?.email?.split('@')[0] || ''} fullWidth />
                <TextField label="Email Address" variant="outlined" value={user?.email || ''} disabled fullWidth />
                <TextField label="Bio" variant="outlined" multiline rows={4} placeholder="Tell us a little about yourself" fullWidth />
                <Button variant="contained" color="primary" sx={{ width: 'fit-content', borderRadius: 2 }}>Save Changes</Button>
              </Box>
            </Box>
          )}

          {/* Preferences Tab */}
          {tabIndex === 1 && (
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Application Theme</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Customize the look and feel of the application.
              </Typography>
              <FormControlLabel 
                control={<Switch checked={theme.palette.mode === 'dark'} onChange={colorMode.toggleColorMode} color="primary" />} 
                label={`Dark Mode (${theme.palette.mode === 'dark' ? 'On' : 'Off'})`} 
                sx={{ mb: 4 }}
              />

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom fontWeight="bold">Editor Preferences</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '500px' }}>
                <TextField 
                  select 
                  label="Default Coding Language" 
                  defaultValue="javascript" 
                  SelectProps={{ native: true }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </TextField>
                
                <TextField 
                  select 
                  label="Editor Theme" 
                  defaultValue="vs-dark" 
                  SelectProps={{ native: true }}
                >
                  <option value="vs-dark">Visual Studio Dark</option>
                  <option value="light">Visual Studio Light</option>
                  <option value="hc-black">High Contrast Black</option>
                </TextField>

                <Button variant="contained" color="primary" sx={{ width: 'fit-content', borderRadius: 2 }}>Save Preferences</Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
