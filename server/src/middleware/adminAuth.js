
const { query } = require('../config/db');
const jwt = require('jsonwebtoken');

/**
 * Middleware to verify admin access using JWT token
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization token'
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token (in a real app, use a proper JWT secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    
    // Get user profile to check role
    const { data: profileData, error: profileError } = await query(
      'SELECT role FROM profiles WHERE id = $1',
      [decoded.userId]
    );
      
    if (profileError || !profileData || profileData.length === 0) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        error: 'Server Error',
        message: 'Unable to verify user role'
      });
    }
    
    // Check if user is an educator (admin)
    if (profileData[0].role !== 'educator') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Educator role required for this operation'
      });
    }
    
    // Add user info to request for use in controllers
    req.user = {
      id: decoded.userId,
      role: profileData[0].role
    };
    
    // If all checks pass, proceed
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Authentication process failed'
    });
  }
};

module.exports = { adminAuth };
