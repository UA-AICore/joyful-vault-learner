
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const supabase = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test Supabase connection on startup
supabase.testConnection()
  .then(success => {
    if (!success) {
      console.error('Warning: Could not connect to Supabase. Check your configuration.');
    }
  })
  .catch(err => {
    console.error('Error testing Supabase connection:', err);
  });

// Routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
