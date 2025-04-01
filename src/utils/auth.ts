
import bcryptjs from 'bcryptjs';
import { query } from '../config/db';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, SALT_ROUNDS);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hash);
};

// Parse JWT token without verification (for client-side use only)
export const parseToken = (token: string): any => {
  try {
    // Basic parsing of JWT without verification
    // This is just for reading data on the client side
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
};

// User authentication
export const authenticateUser = async (email: string, password: string) => {
  try {
    // Get user from database
    const { data, error } = await query(
      'SELECT * FROM user_accounts WHERE email = $1',
      [email]
    );

    if (error || !data || data.length === 0) {
      return { user: null, error: 'Invalid email or password' };
    }

    // Verify password
    const user = data[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return { user: null, error: 'Invalid email or password' };
    }

    // Get user profile
    const { data: profileData } = await query(
      'SELECT * FROM profiles WHERE id = $1',
      [user.id]
    );

    if (!profileData || profileData.length === 0) {
      return { user: null, error: 'User profile not found' };
    }

    // Generate token on the server side via auth API
    const tokenResponse = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        role: profileData[0].role,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Token generation failed');
    }

    const { token } = await tokenResponse.json();

    const profile = profileData[0];
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar
      },
      token,
      error: null
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
};
