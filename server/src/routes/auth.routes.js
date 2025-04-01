
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Route to generate token for authenticated users
router.post('/token', async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const token = generateToken(userId, role);
    res.json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate authentication token' });
  }
});

// Hash password for client-side registration
router.post('/hash-password', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    
    res.send(hash);
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).json({ error: 'Failed to hash password' });
  }
});

// Verify token route for client-side validation
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token is required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    console.error('Token verification error:', error);
    res.json({ valid: false, error: error.message });
  }
});

module.exports = router;
