import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap, Globe, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setCredentials } from '../redux/slices/authSlice';
import { Button, Input, Card } from '../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Automatically redirect if already logged in (e.g., returning from Google OAuth)
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Recruiter' || user.role === 'Admin') {
        navigate('/recruiter/profile', { replace: true });
      } else {
        navigate('/student/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data?.user) {
        // Fetch user profile for role
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userWithRole = { 
          ...data.user, 
          role: profile?.role || 'Candidate' 
        };

        dispatch(setCredentials({
          user: userWithRole,
          token: data.session?.access_token,
        }));

        // Route based on role
        if (userWithRole.role === 'Recruiter') {
          navigate('/recruiter/profile');
        } else {
          navigate('/student/profile');
        }
      }
    } catch (err) {
      const msg = err.message || 'Invalid login credentials';
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid credentials. Please sign up first if you do not have an account.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
            <span className="text-sm font-bold text-white tracking-tight">Interview.ai</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white">Welcome back</h1>
          <p className="text-zinc-500">Enter your credentials to access your dashboard</p>
        </div>

        <Card className="p-8 space-y-6 shadow-premium">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
            <Input 
              label="Email Address" 
              placeholder="name@company.com" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-violet-500 hover:text-violet-400">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full py-4 text-base" isLoading={loading}>
              Sign in to Platform <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-600 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full py-4 border-zinc-800 hover:border-zinc-700"
            onClick={handleGoogleLogin}
          >
            <Globe className="w-5 h-5 text-violet-500" />
            Sign in with Google
          </Button>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-500 font-bold hover:text-violet-400 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
