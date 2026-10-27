import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, fullName?: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if demo session or Supabase session is stored
    const storedDemo = localStorage.getItem('skillbridge_demo_mode');
    const storedUser = localStorage.getItem('skillbridge_user');

    if ((storedDemo === 'true' || !isSupabaseConfigured) && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsDemoMode(storedDemo === 'true');
        setLoading(false);
        return;
      } catch (e) {
        // Continue to Supabase check
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
          });
          localStorage.setItem('skillbridge_auth_token', session.access_token);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
          });
          localStorage.setItem('skillbridge_auth_token', session.access_token);
        } else if (!isDemoMode) {
          setUser(null);
          localStorage.removeItem('skillbridge_auth_token');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Not logged in by default; user can explore landing page or click One-Click Demo Sign In
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || '',
          });
          localStorage.setItem('skillbridge_auth_token', data.session.access_token);
          setIsDemoMode(false);
          localStorage.removeItem('skillbridge_demo_mode');
        }
      } else {
        // Local mode login
        const loggedUser: User = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          full_name: email.split('@')[0],
        };
        setUser(loggedUser);
        setIsDemoMode(true);
        localStorage.setItem('skillbridge_demo_mode', 'true');
        localStorage.setItem('skillbridge_user', JSON.stringify(loggedUser));
        localStorage.setItem('skillbridge_auth_token', 'demo-token');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password?: string, fullName?: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || '' },
          },
        });
        if (error) throw error;
        if (data.session) {
          setUser({
            id: data.user!.id,
            email: data.user!.email || '',
            full_name: fullName || '',
          });
          localStorage.setItem('skillbridge_auth_token', data.session.access_token);
          setIsDemoMode(false);
        }
      } else {
        const newUser: User = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          full_name: fullName || email.split('@')[0],
        };
        setUser(newUser);
        setIsDemoMode(true);
        localStorage.setItem('skillbridge_demo_mode', 'true');
        localStorage.setItem('skillbridge_user', JSON.stringify(newUser));
        localStorage.setItem('skillbridge_auth_token', 'demo-token');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'alex.chen@skillbridge.ai',
      full_name: 'Alex Chen',
    };
    setUser(demoUser);
    setIsDemoMode(true);
    localStorage.setItem('skillbridge_demo_mode', 'true');
    localStorage.setItem('skillbridge_user', JSON.stringify(demoUser));
    localStorage.setItem('skillbridge_auth_token', 'demo-token');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('skillbridge_demo_mode');
    localStorage.removeItem('skillbridge_user');
    localStorage.removeItem('skillbridge_auth_token');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        signup,
        loginAsDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
