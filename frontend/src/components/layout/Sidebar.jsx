import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = ({ drawerOpen }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Practice (AI)', icon: <SmartToyIcon />, path: '/practice' },
    { text: 'Host / Join', icon: <PeopleIcon />, path: '/host-join' },
    { text: 'History & Reports', icon: <AnalyticsIcon />, path: '/history' },
    { text: 'Analytics Hub', icon: <BarChartIcon />, path: '/analytics-hub' },
    { text: 'Question Bank', icon: <FolderIcon />, path: '/questions' },
  ];

  const bottomMenuItems = [
    { text: 'Support', icon: <HelpOutlinedIcon />, path: 'mailto:vineet@gmail.com?subject=InterviewPro Support Request' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const renderListItem = (item) => {
    const isSelected = location.pathname.startsWith(item.path);
    const content = (
      <ListItem 
        button 
        key={item.text} 
        {...(item.path.startsWith('mailto:') 
          ? { component: 'a', href: item.path } 
          : { component: Link, to: item.path })}
        sx={{
          minHeight: 48,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: 2.5,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          bgcolor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
          color: isSelected ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: isSelected ? 'rgba(79, 70, 229, 0.12)' : 'action.hover',
          }
        }}
      >
        <ListItemIcon 
          sx={{ 
            minWidth: 0, 
            mr: drawerOpen ? 3 : 'auto', 
            justifyContent: 'center',
            color: isSelected ? 'primary.main' : 'inherit'
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          sx={{ opacity: drawerOpen ? 1 : 0 }} 
          primaryTypographyProps={{ 
            fontWeight: isSelected ? 600 : 500,
            fontSize: '0.95rem'
          }} 
        />
      </ListItem>
    );

    return drawerOpen ? content : <Tooltip key={item.text} title={item.text} placement="right">{content}</Tooltip>;
  };

  return (
    <Drawer variant="permanent" open={drawerOpen}>
      {/* Spacer for TopHeader */}
      <Box sx={{ height: 64 }} /> 
      
      <Box sx={{ overflowX: 'hidden', overflowY: 'auto', flexGrow: 1, py: 2 }}>
        <List>
          {menuItems.map(renderListItem)}
        </List>
      </Box>

      <Box sx={{ pb: 2 }}>
        <Divider sx={{ mb: 2, mx: 2 }} />
        <List>
          {bottomMenuItems.map(renderListItem)}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
