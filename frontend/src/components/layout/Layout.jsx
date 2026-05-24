import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Paths that don't need the authenticated layout
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';
  // The room view needs full screen (no sidebar, custom header maybe)
  const isRoomRoute = location.pathname.startsWith('/room/');

  if (isPublicRoute || !user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
              AI Interview Platform
            </Typography>
            {user ? (
              <Button color="inherit" onClick={signOut}>Logout</Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    );
  }

  if (isRoomRoute) {
    return <Box>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopHeader drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <Sidebar drawerOpen={drawerOpen} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          p: 3, 
          mt: 8, 
          width: { sm: `calc(100% - ${drawerOpen ? 260 : 72}px)` },
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
