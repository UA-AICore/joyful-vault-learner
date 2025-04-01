
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
const testConnection = async () => {
  try {
    console.log('Testing PostgreSQL connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('PostgreSQL connection successful!', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('PostgreSQL connection test failed:', err);
    return false;
  }
};

// Helper function to execute queries
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return { data: result.rows, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error };
  }
};

module.exports = { pool, query, testConnection };
