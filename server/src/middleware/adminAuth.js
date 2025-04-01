
const supabase = require('../config/supabase');

/**
 * Middleware to verify admin access using Supabase token
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
    
    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
    
    if (!user) {
      console.error('No user found for token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }
    
    // Get user profile to check role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        error: 'Server Error',
        message: 'Unable to verify user role'
      });
    }
    
    if (!profileData) {
      console.error('No profile found for user:', user.id);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User profile not found'
      });
    }
    
    // Check if user is an educator (admin)
    if (profileData.role !== 'educator') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Educator role required for this operation'
      });
    }
    
    // Add user info to request for use in controllers
    req.user = {
      id: user.id,
      role: profileData.role
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
