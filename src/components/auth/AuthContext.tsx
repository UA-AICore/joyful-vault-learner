
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authenticateUser, verifyToken } from '@/utils/auth';
import { query } from '@/config/db';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for token and fetch user on load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedToken) {
          const decoded = verifyToken(storedToken);
          
          if (decoded && decoded.userId) {
            await fetchUserProfile(decoded.userId);
            setToken(storedToken);
          } else {
            // Token invalid or expired
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await query(
        'SELECT p.*, u.email FROM profiles p JOIN user_accounts u ON p.id = u.id WHERE p.id = $1',
        [userId]
      );

      if (error || !data || data.length === 0) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      const profile = data[0];
      const userProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar
      };
      
      console.log('User profile set:', userProfile);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string, role: 'student' | 'educator') => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email, 'as', role);
      
      const { user, token: authToken, error } = await authenticateUser(email, password);

      if (error || !user) {
        console.error('Login error:', error);
        throw new Error(error || 'Login failed');
      }

      if (user.role !== role) {
        throw new Error(`Invalid role. You are registered as a ${user.role}, not a ${role}.`);
      }

      // Save token and user
      localStorage.setItem('auth_token', authToken as string);
      setToken(authToken);
      setUser(user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`
      });
    } catch (error: any) {
      console.error('Login process error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'educator') => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email, 'as', role);
      
      // This would need to be implemented based on your registration flow
      // For now, showing an example implementation
      const { data: existingUser } = await query(
        'SELECT * FROM user_accounts WHERE email = $1',
        [email]
      );

      if (existingUser && existingUser.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password and create user
      // In a real implementation, this would be handled by a server endpoint
      const hashedPassword = await fetch('/api/auth/hash-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      }).then(res => res.text());

      // Insert user and profile
      const { data: userData, error: userError } = await query(
        'INSERT INTO user_accounts (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, hashedPassword]
      );

      if (userError || !userData || userData.length === 0) {
        throw new Error('Failed to create user account');
      }

      const userId = userData[0].id;

      const { error: profileError } = await query(
        'INSERT INTO profiles (id, name, role, avatar) VALUES ($1, $2, $3, $4)',
        [userId, name, role, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`]
      );

      if (profileError) {
        throw new Error('Failed to create user profile');
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now login."
      });
    } catch (error: any) {
      console.error('Registration process error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different information.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      
      localStorage.removeItem('auth_token');
      setToken(null);
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
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isEducator }}>
      {children}
    </AuthContext.Provider>
  );
};
