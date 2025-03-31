
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack trace:', err.stack);
  
  // Check if the error is from Supabase
  if (err.error && err.status) {
    return res.status(err.status).json({
      error: err.error,
      message: err.message,
      details: err.details || 'No additional details provided'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }

  // Handle database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.message.includes('database')) {
    return res.status(503).json({
      error: 'Database Error',
      message: 'Unable to connect to the database. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.name || 'Server Error',
    message: err.message || 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

module.exports = { errorHandler };
