import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from './lib/supabase';
import { setCredentials, logout } from './redux/slices/authSlice';
import socketClient from './services/socketClient';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

// Pages
import Landing from './pages/Landing';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPwd from './pages/ForgotPwd';
import ResetPwd from './pages/ResetPwd';
import StudentDash from './pages/StudentDash';
import RecruiterDash from './pages/RecruiterDash';
import AIInterview from './pages/AIInterview';
import CodingAssess from './pages/CodingAssess';
import PracticeArena from './pages/PracticeArena';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import LiveMonitoring from './pages/LiveMonitoring';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import QuestionBank from './pages/QuestionBank';
import Settings from './pages/Settings';
import Candidates from './pages/Candidates';
import StudentReports from './pages/StudentReports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  
  const role = user.role || 'Candidate'; // Default to candidate if missing
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'Recruiter' || role === 'Admin') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }
  
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
      <Route path="/reset-password" element={<ResetPwd />} />
      
      <Route element={<ProtectedRoute allowedRoles={['Candidate', 'Student']}><StudentLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDash />} />
        <Route path="/student/practice" element={<PracticeArena />} />
        <Route path="/student/interview" element={<AIInterview />} />
        <Route path="/student/assessment" element={<CodingAssess />} />
        <Route path="/student/reports" element={<StudentReports />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/settings" element={<Settings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Recruiter', 'Admin']}><RecruiterLayout /></ProtectedRoute>}>
        <Route path="/recruiter/dashboard" element={<RecruiterDash />} />
        <Route path="/recruiter/candidates" element={<Candidates />} />
        <Route path="/recruiter/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/recruiter/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/recruiter/reports" element={<Reports />} />
        <Route path="/recruiter/analytics" element={<Analytics />} />
        <Route path="/recruiter/questions" element={<QuestionBank />} />
        <Route path="/recruiter/profile" element={<Profile />} />
        <Route path="/recruiter/settings" element={<Settings />} />
      </Route>

      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for auth state changes (crucial for Google OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch user profile for role
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userWithRole = { 
          ...session.user, 
          role: profile?.role || 'Candidate' 
        };

        dispatch(setCredentials({
          user: userWithRole,
          token: session.access_token,
        }));
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      socketClient.connectBase();
    } else {
      socketClient.disconnectAll();
    }
  }, [isAuthenticated]);

  return (
    <div className="antialiased selection:bg-emerald-500/30 selection:text-emerald-500">
      <AnimatedRoutes />
    </div>
  );
}

export default App;
