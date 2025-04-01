
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: Number(import.meta.env.VITE_DB_PORT) || 5432,
  database: import.meta.env.VITE_DB_NAME || 'postgres',
  user: import.meta.env.VITE_DB_USER || 'postgres',
  password: import.meta.env.VITE_DB_PASSWORD || 'postgres',
  ssl: import.meta.env.VITE_DB_SSL === 'true' ? true : false,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  }
});

// Helper function for easier query execution
export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return { data: result.rows, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error };
  }
};

export default pool;
