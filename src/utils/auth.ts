
import bcryptjs from 'bcryptjs';
import jwt_decode from 'jwt-decode';

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
    // Using jwt-decode for client-side parsing only
    return jwt_decode(token);
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
};

// Mock users for temporary authentication
const MOCK_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password_hash: '$2a$10$zXEHJIlyta8YJ.oJtZ1ABOUKqNiIy5ADXWJqnYxQRQSCYP/hS9.dG', // password123
    profile: {
      id: '1',
      name: 'Student User',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'
    }
  },
  {
    id: '2',
    email: 'educator@example.com',
    password_hash: '$2a$10$zXEHJIlyta8YJ.oJtZ1ABOUKqNiIy5ADXWJqnYxQRQSCYP/hS9.dG', // password123
    profile: {
      id: '2',
      name: 'Educator User',
      role: 'educator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=educator'
    }
  }
];

// Mock registered users (for registration functionality)
let registeredUsers = [...MOCK_USERS];

// User authentication
export const authenticateUser = async (email: string, password: string) => {
  try {
    console.log('Authenticating user:', email);
    
    // Find user in mock data
    const user = registeredUsers.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found');
      return { user: null, error: 'Invalid email or password' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      console.log('Invalid password');
      return { user: null, error: 'Invalid email or password' };
    }

    // Generate token on the server side via auth API
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        role: user.profile.role,
      }),
    });

    if (!response.ok) {
      throw new Error('Token generation failed');
    }

    const { token } = await response.json();
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile.name,
        role: user.profile.role,
        avatar: user.profile.avatar
      },
      token,
      error: null
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
};

// Add a new user (for registration)
export const registerUser = async (name: string, email: string, passwordHash: string, role: 'student' | 'educator') => {
  try {
    // Check if user already exists
    if (registeredUsers.some(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Create a new user ID
    const id = (registeredUsers.length + 1).toString();
    
    // Create new user
    const newUser = {
      id,
      email,
      password_hash: passwordHash,
      profile: {
        id,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      }
    };
    
    // Add to mock database
    registeredUsers.push(newUser);
    
    console.log('New user registered:', { id, email, name, role });
    
    return { success: true, userId: id };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
};
