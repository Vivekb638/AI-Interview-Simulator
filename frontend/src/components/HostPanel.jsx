import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { supabase } from '../lib/supabase';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const CONCEPTS = [
  "Time Complexity Explained",
  "Space Complexity Evaluated",
  "Edge Cases Handled",
  "Clear Variable Naming"
];

const HostPanel = ({ roomId }) => {
  const [cheatWarnings, setCheatWarnings] = useState([]);
  const [isEditorLocked, setIsEditorLocked] = useState(false);
  const [checkedConcepts, setCheckedConcepts] = useState([false, false, false, false]);

  useEffect(() => {
    const channel = supabase.channel(`code:${roomId}`);

    channel.on('broadcast', { event: 'cheat-warning' }, (payload) => {
      setCheatWarnings(prev => [...prev, {
        user: payload.payload.user,
        reason: payload.payload.reason,
        time: new Date().toLocaleTimeString()
      }]);
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const toggleEditorLock = () => {
    const newState = !isEditorLocked;
    setIsEditorLocked(newState);
    
    // Broadcast the lock event to the room
    const channel = supabase.channel(`code:${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'editor-lock',
      payload: { locked: newState }
    });
  };

  const handleToggleConcept = (index) => {
    const newChecked = [...checkedConcepts];
    newChecked[index] = !newChecked[index];
    setCheckedConcepts(newChecked);
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" display="flex" alignItems="center" gap={1} color="secondary">
        <AdminPanelSettingsIcon /> Interviewer Controls
      </Typography>

      <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 1, borderLeft: '4px solid', borderLeftColor: 'primary.main', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2">Room Invitation</Typography>
        <Typography variant="body2" color="text.secondary">Share this link with the candidate:</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input 
            type="text" 
            readOnly 
            value={window.location.href} 
            style={{ flex: 1, padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'transparent', color: 'inherit' }}
          />
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            sx={{ textTransform: 'none' }}
          >
            Copy Link
          </Button>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 1, borderLeft: '4px solid', borderLeftColor: 'error.main' }}>
        <Typography variant="subtitle2" gutterBottom>Proctoring Alerts</Typography>
        {cheatWarnings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No anomalies detected.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {cheatWarnings.map((warn, i) => (
              <Alert key={i} severity="error" sx={{ '& .MuiAlert-message': { p: 0, fontSize: '0.8rem' } }}>
                <b>{warn.time}</b>: {warn.reason}
              </Alert>
            ))}
          </Box>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>Host Actions</Typography>
        <Button 
          variant="contained" 
          color={isEditorLocked ? "success" : "error"} 
          fullWidth
          onClick={toggleEditorLock}
        >
          {isEditorLocked ? "Unlock Candidate Editor" : "Lock Candidate Editor"}
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" gutterBottom>Evaluation Checklist</Typography>
        <List dense>
          {CONCEPTS.map((concept, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemIcon sx={{ minWidth: '32px' }}>
                <Checkbox 
                  edge="start" 
                  checked={checkedConcepts[idx]} 
                  onChange={() => handleToggleConcept(idx)}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{concept}</Typography>} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default HostPanel;
