
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authenticateUser, parseToken, registerUser, hashPassword } from '@/utils/auth';

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
          // Verify token with the server
          const verifyResponse = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: storedToken }),
          });
          
          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.valid && verifyResult.decoded?.userId) {
            // For our temporary solution, we'll just use the token data
            // In a real solution, this would fetch the user profile from the database
            setUser({
              id: verifyResult.decoded.userId,
              name: verifyResult.decoded.userId === '1' ? 'Student User' : 'Educator User',
              email: verifyResult.decoded.userId === '1' ? 'student@example.com' : 'educator@example.com',
              role: verifyResult.decoded.role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${verifyResult.decoded.role}`
            });
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
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Register user with our in-memory function
      const { success, error, userId } = await registerUser(name, email, hashedPassword, role);
      
      if (!success) {
        throw new Error(error || 'Registration failed');
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
