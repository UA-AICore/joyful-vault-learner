
import jwt from 'jsonwebtoken';
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

// Generate JWT token
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
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

    const profile = profileData[0];
    const token = generateToken(user.id, profile.role);

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
