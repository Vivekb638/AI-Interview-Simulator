import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Dialog, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Code, LayoutDashboard, History, Activity, HelpCircle } from 'lucide-react';
import './SearchModal.css'; // We'll need a minimal CSS file for cmdk styling

const SearchModal = ({ open, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          maxWidth: '600px',
          width: '100%',
        }
      }}
    >
      <Box sx={{ 
        bgcolor: '#0f172a', 
        borderRadius: 3, 
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        <Command className="cmdk-root" label="Global Command Menu">
          <div className="cmdk-input-wrapper">
            <Search className="cmdk-search-icon" />
            <Command.Input placeholder="Search past sessions, questions, or pages..." />
          </div>
          
          <Command.List className="cmdk-list">
            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => runCommand(() => navigate('/dashboard'))}>
                <LayoutDashboard className="cmdk-item-icon" />
                Dashboard
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/practice'))}>
                <Code className="cmdk-item-icon" />
                AI Practice
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/analytics-hub'))}>
                <Activity className="cmdk-item-icon" />
                Analytics Hub
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/history'))}>
                <History className="cmdk-item-icon" />
                History & Reports
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/support'))}>
                <HelpCircle className="cmdk-item-icon" />
                Support Terminal
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Quick Actions">
              <Command.Item onSelect={() => runCommand(() => console.log('Create new session'))}>
                + Host New Interview Session
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => console.log('Join session'))}>
                → Join Existing Room
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </Box>
    </Dialog>
  );
};

export default SearchModal;
