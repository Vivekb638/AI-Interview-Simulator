import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert, Paper } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthBackground = ({ children }) => (
  <Box sx={{ 
    minHeight: '100vh', 
    width: '100vw', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundImage: 'url(/ai-interview-bg.png)', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}>
    <Box sx={{ width: '100%', maxWidth: '450px', p: 2 }}>
      {children}
    </Box>
  </Box>
);

const GlassPaper = ({ children }) => (
  <Paper elevation={24} sx={{
    p: 4, 
    textAlign: 'center', 
    bgcolor: 'rgba(15, 20, 25, 0.85)', 
    backdropFilter: 'blur(16px)', 
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
  }}>
    {children}
  </Paper>
);

const CustomTextField = (props) => (
  <TextField 
    {...props} 
    variant="outlined" 
    fullWidth 
    margin="normal" 
    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
    InputProps={{ style: { color: '#fff', borderRadius: '8px' } }}
    sx={{
      '& .MuiOutlinedInput-root': {
        bgcolor: 'rgba(0,0,0,0.3)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
        '&.Mui-focused fieldset': { borderColor: '#1976d2' },
      }
    }}
  />
);

const SolidBtn = ({ children, ...props }) => (
  <Button 
    {...props}
    fullWidth
    variant="contained" 
    sx={{ 
      mt: 2, mb: 1, 
      bgcolor: '#1976d2', 
      borderRadius: '8px',
      textTransform: 'none',
      fontSize: '1.1rem',
      color: 'white',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
      '&:hover': {
        bgcolor: '#115293',
      }
    }}
  >
    {children}
  </Button>
);

export const LandingPage = () => (
  <AuthBackground>
    <GlassPaper>
      <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
        AI Interview Platform
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }} paragraph>
        A scalable real-time interview system with AI evaluation, voice analysis, and code execution.
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SolidBtn component={Link} to="/login">
          Get Started
        </SolidBtn>
        <Button component={Link} to="/dashboard" variant="outlined" size="large" sx={{ borderRadius: '8px', borderColor: 'rgba(255,255,255,0.5)', color: 'white', textTransform: 'none', fontSize: '1.1rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Go to Dashboard
        </Button>
      </Box>
    </GlassPaper>
  </AuthBackground>
);

export const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) return setErrorMsg('Please enter both email and password.');
    const { error } = await signInWithEmail(email, password);
    if (error) setErrorMsg(error.message);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) setErrorMsg(`Google Auth Error: ${error.message}. Ensure Google provider is enabled in Supabase.`);
  };

  return (
    <AuthBackground>
      <GlassPaper>
        <Typography variant="h4" gutterBottom fontWeight="bold">Login</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }} paragraph>Sign in to your account</Typography>
        
        {errorMsg && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.8)', color: 'white' }}>{errorMsg}</Alert>}
        
        <CustomTextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <CustomTextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <SolidBtn onClick={handleLogin}>Login</SolidBtn>
        
        <Typography variant="body2" sx={{ mb: 2, mt: 1, color: 'rgba(255,255,255,0.7)' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#64b5f6', textDecoration: 'none', fontWeight: 'bold' }}>Sign up</Link>
        </Typography>

        <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.2)' }, color: 'rgba(255,255,255,0.5)' }}>OR</Divider>

        <Button variant="outlined" onClick={handleGoogleLogin} fullWidth sx={{ mb: 2, color: 'white', borderColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Sign In With Google
        </Button>
      </GlassPaper>
    </AuthBackground>
  );
};

export const SignUpPage = () => {
  const { signInWithGoogle, signUpWithEmail, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleSignUp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password || !confirmPassword) return setErrorMsg('Please fill in all fields.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    
    const { data, error } = await signUpWithEmail(email, password);
    
    if (error) {
      setErrorMsg(error.message);
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setErrorMsg('An account with this email already exists.');
    } else {
      setSuccessMsg('Sign up successful! Please check your email to confirm your account.');
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) setErrorMsg(`Google Auth Error: ${error.message}. Ensure Google provider is enabled in Supabase.`);
  };

  return (
    <AuthBackground>
      <GlassPaper>
        <Typography variant="h4" gutterBottom fontWeight="bold">Sign Up</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }} paragraph>Create a new account</Typography>
        
        {errorMsg && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.8)', color: 'white' }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(56, 142, 60, 0.8)', color: 'white' }}>{successMsg}</Alert>}
        
        <CustomTextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <CustomTextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <CustomTextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        
        <SolidBtn onClick={handleSignUp}>Sign Up</SolidBtn>
        
        <Typography variant="body2" sx={{ mb: 2, mt: 1, color: 'rgba(255,255,255,0.7)' }}>
          Already have an account? <Link to="/login" style={{ color: '#64b5f6', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
        </Typography>

        <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.2)' }, color: 'rgba(255,255,255,0.5)' }}>OR</Divider>

        <Button variant="outlined" onClick={handleGoogleSignUp} fullWidth sx={{ mb: 2, color: 'white', borderColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Sign Up With Google
        </Button>
      </GlassPaper>
    </AuthBackground>
  );
};
