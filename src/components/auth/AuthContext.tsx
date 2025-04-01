
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
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user data:', userError);
          throw userError;
        }
        
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
    const initAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Initializing auth...');
        
        // Get current session first to prevent race conditions
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }
        
        console.log('Initial session check:', sessionData?.session?.user?.id);
        setSession(sessionData.session);
        
        // If session exists, fetch user profile
        if (sessionData.session?.user) {
          await fetchUserProfile(sessionData.session.user.id);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession?.user?.id);
            setSession(currentSession);
            
            if (event === 'SIGNED_IN' && currentSession) {
              // Avoid potential Supabase auth deadlock by using setTimeout
              setTimeout(() => {
                fetchUserProfile(currentSession.user.id);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
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
        console.log('Login successful for user:', data.user.id);
        
        // Role verification will happen in fetchUserProfile triggered by auth state change
      } else {
        console.error('Login returned no user data');
        throw new Error('Login failed');
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      
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
