import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Globe, User, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setCredentials } from '../redux/slices/authSlice';
import { Button, Input, Card, Badge } from '../components/ui';

const Signup = () => {
  const [role, setRole] = useState('Candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Automatically redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Recruiter' || user.role === 'Admin') {
        navigate('/recruiter/profile', { replace: true });
      } else {
        navigate('/student/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Auth Signup
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      });

      if (authError) throw authError;

      if (data?.user) {
        // Note: The SQL trigger handle_new_user() will automatically 
        // insert the profile into public.users.
        
        dispatch(setCredentials({
          user: { ...data.user, role },
          token: data.session?.access_token,
        }));

        // Route based on role to profile page for onboarding
        if (role === 'Recruiter') {
          navigate('/recruiter/profile');
        } else {
          navigate('/student/profile');
        }
      }
    } catch (err) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { role } // Pass role to metadata
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
            <span className="text-sm font-bold text-white tracking-tight">Interview.ai</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white">Create your account</h1>
          <p className="text-zinc-500">Join 5,000+ engineers and recruitment teams today</p>
        </div>

        <Card className="p-8 space-y-8 shadow-premium relative">
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl">
             <button 
                onClick={() => setRole('Candidate')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${role === 'Candidate' ? 'bg-zinc-900 text-violet-500 border border-zinc-800 shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
             >
                <User className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Candidate</span>
             </button>
             <button 
                onClick={() => setRole('Recruiter')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${role === 'Recruiter' ? 'bg-zinc-900 text-violet-500 border border-zinc-800 shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
             >
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Recruiter</span>
             </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
               <Input 
                 label="Full Name" 
                 placeholder="Alex Johnson" 
                 required
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
               />
            </div>
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

            <Button type="submit" className="w-full py-4 text-base" isLoading={loading}>
               Create Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="space-y-4">
             <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                   <span className="bg-zinc-900 px-2 text-zinc-600 font-bold tracking-widest">Or continue with</span>
                </div>
             </div>
             <Button 
                variant="secondary" 
                className="w-full py-4 border-zinc-800 hover:border-zinc-700"
                onClick={handleGoogleSignup}
             >
               <Globe className="w-5 h-5 text-violet-500" />
               Continue with Google
             </Button>
          </div>

          <p className="text-[10px] text-zinc-600 text-center uppercase font-bold tracking-widest px-8 leading-relaxed">
             By continuing, you agree to our <span className="text-zinc-400">Terms of Service</span> and <span className="text-zinc-400">Privacy Policy</span>.
          </p>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-500 font-bold hover:text-violet-400 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
