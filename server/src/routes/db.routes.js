
const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // In a real implementation, you would verify the token here
  // For now, we'll assume any token is valid for demo purposes
  next();
};

// Route to handle database queries from the client
router.post('/query', authMiddleware, async (req, res) => {
  try {
    const { query: queryText, params } = req.body;
    
    // Validate query for security - this is a simple example, you should implement more robust validation
    const disallowedKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE'];
    if (disallowedKeywords.some(keyword => queryText.toUpperCase().includes(keyword))) {
      return res.status(403).json({ error: 'Forbidden query type' });
    }
    
    const { data, error } = await query(queryText, params);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ rows: data, rowCount: data.length });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
