
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'student' | 'educator') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'educator') => Promise<void>;
  logout: () => Promise<void>;
  isEducator: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      if (data) {
        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser();
        
        setUser({
          id: data.id,
          name: data.name,
          email: userData.user?.email || '',
          role: data.role,
          avatar: data.avatar
        });
        
        console.log('User profile set:', data);
      } else {
        console.warn('No profile found for user:', userId);
        setUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    }
  };

  // Check for session on load
  useEffect(() => {
    setIsLoading(true);
    console.log('Setting up auth state listener');

    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (event === 'SIGNED_IN' && currentSession) {
          // Use setTimeout to prevent potential Supabase auth deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.id);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'educator') => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email, 'as', role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        // Get user profile
        console.log('Fetching profile after login for user:', data.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        if (!profileData) {
          console.error('No profile found for user after login');
          throw new Error('User profile not found');
        }

        // Verify user role
        if (profileData.role !== role) {
          // Sign out if wrong role
          console.error('Role mismatch:', profileData.role, 'vs requested', role);
          await supabase.auth.signOut();
          throw new Error(`Invalid role. This account is registered as a ${profileData.role}.`);
        }
      }
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'educator') => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email, 'as', role);
      
      // Sign up the user with additional metadata for the trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('Registration failed - no user returned');
        throw new Error('Registration failed');
      }

      console.log('Registration successful for:', data.user.id);
      // Profile creation is handled by database trigger
    } catch (error) {
      console.error('Registration process error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isEducator = () => user?.role === 'educator';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isEducator }}>
      {children}
    </AuthContext.Provider>
  );
};
