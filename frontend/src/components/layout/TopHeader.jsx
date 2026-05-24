import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Badge, useTheme, Divider, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { ColorModeContext } from '../../App';
import { useAuth } from '../../context/AuthContext';
import SearchModal from './SearchModal';

const TopHeader = ({ drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          top: 16, // Float it down from the top edge
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1200px', // Constrain width for the pill look
          borderRadius: 8, // Pill shape
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.7)', 
          backdropFilter: 'blur(20px)', // Strong glassmorphism
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: '64px !important' }}>
          {/* Left Side: Menu and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <TerminalOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="800" sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.5px' }}>
                InterviewPro
              </Typography>
            </Box>
          </Box>

          {/* Center Side: Global Search Bar Trigger */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box 
              onClick={() => setSearchOpen(true)}
              className="magnetic-target"
              sx={{ 
                display: 'flex', alignItems: 'center', 
                bgcolor: alpha(theme.palette.text.primary, 0.04), 
                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
                borderRadius: 2, 
                px: 2, py: 0.5, 
                width: '100%', maxWidth: 400,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <Typography sx={{ flexGrow: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
                Search past sessions or questions...
              </Typography>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', gap: 0.5, 
                bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, 
                borderRadius: 1, px: 0.8, py: 0.2, ml: 1 
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.7rem' }}>⌘K</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side: Theme, Notifications, Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            <IconButton color="inherit" onClick={() => console.log('Show notifications')}>
              <Badge variant="dot" color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <Box sx={{ ml: 1 }}>
              <IconButton
                size="small"
                onClick={handleMenu}
                color="inherit"
                sx={{ p: 0 }}
              >
                <Avatar 
                  src={user?.user_metadata?.avatar_url || user?.photoURL}
                  sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 'bold' }}
                >
                  {!user?.user_metadata?.avatar_url && !user?.photoURL && (user?.email?.[0].toUpperCase() || 'U')}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                    '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 },
                  },
                }}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>My Account</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 'bold' }}>Log Out</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Global Search Modal via cmdk */}
      <SearchModal open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
};

export default TopHeader;
