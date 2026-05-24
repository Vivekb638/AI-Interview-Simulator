import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // 'Student' or 'Teacher', null if missing (OAuth edge case)

  const fetchRole = async (userId) => {
    const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
    if (data && data.role) {
      setRole(data.role);
    } else {
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const signInWithEmail = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email, password, selectedRole) => {
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { role: selectedRole }
      }
    });
  };

  const updateRole = async (newRole) => {
    if (!user) return;
    // Update public.users
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', user.id);
    if (!error) setRole(newRole);
    return { error };
  };

  const signOut = async () => {
    if (user?.id === 'guest') {
      setUser(null);
      return;
    }
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, setRole, updateRole, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
