import React, { useState, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';

import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { LandingPage, LoginPage, SignUpPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Room } from './pages/Room';
import { Practice } from './pages/Practice';
import { QuestionBank } from './pages/QuestionBank';
import { HostJoin } from './pages/HostJoin';
import { AnalyticsHub } from './pages/AnalyticsHub';
import { Support } from './pages/Placeholders';
import { History } from './pages/History';
import { Report } from './pages/Report';
import { Settings } from './pages/Settings';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const theme = useMemo(() => {
    // Premium UI Rules: Custom soft shadows
    const lightShadows = [
      'none',
      '0px 2px 4px rgba(15, 23, 42, 0.04)',
      '0px 4px 6px rgba(15, 23, 42, 0.06)',
      '0px 10px 15px rgba(15, 23, 42, 0.08)',
      '0px 20px 25px rgba(15, 23, 42, 0.1)',
      ...Array(20).fill('none') // Fill remaining MUI shadows
    ];
    
    const darkShadows = [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.2)',
      '0px 4px 6px rgba(0, 0, 0, 0.3)',
      '0px 10px 15px rgba(0, 0, 0, 0.4)',
      '0px 20px 25px rgba(0, 0, 0, 0.5)',
      ...Array(20).fill('none')
    ];

    return createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              primary: { main: '#4F46E5' },
              background: { default: '#F8FAFC', paper: '#FFFFFF' },
              text: { primary: '#1E293B', secondary: '#64748B' }, // Subdued typography
              divider: '#E2E8F0',
            }
          : {
              primary: { main: '#8B5CF6' },
              background: { default: '#0F172A', paper: '#1E293B' }, // Surface colors
              text: { primary: '#F8FAFC', secondary: '#94A3B8' },
              divider: '#334155',
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
        h3: { color: mode === 'light' ? '#0F172A' : '#F8FAFC' },
        h5: { color: mode === 'light' ? '#1E293B' : '#F8FAFC' },
      },
      shape: { borderRadius: 16 }, // Rule 2: Round the corners (16px)
      shadows: mode === 'light' ? lightShadows : darkShadows, // Rule 1: Custom Shadows
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none', // Remove default MUI dark mode gradient on surfaces
            }
          }
        }
      }
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
              <Route path="/host-join" element={<ProtectedRoute><HostJoin /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/analytics-hub" element={<ProtectedRoute><AnalyticsHub /></ProtectedRoute>} />
              <Route path="/questions" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              
              {/* Full Screen Room Route */}
              <Route path="/room/:id" element={<ProtectedRoute><Room /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
