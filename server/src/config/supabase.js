
// This file is kept for compatibility but now uses direct PostgreSQL
const { query } = require('./db');

// For backward compatibility with existing code
const supabase = {
  from: (table) => ({
    select: async (columns = '*') => {
      return await query(`SELECT ${columns} FROM ${table}`);
    },
    insert: async (values) => {
      if (!Array.isArray(values)) values = [values];
      
      // Handle the first item in the array
      const firstItem = values[0];
      const columns = Object.keys(firstItem).join(', ');
      
      // Build the VALUES part with parameterized queries
      let valuesSql = '';
      let params = [];
      let paramCounter = 1;
      
      for (let i = 0; i < values.length; i++) {
        const item = values[i];
        const itemValues = Object.values(item);
        
        valuesSql += '(';
        for (let j = 0; j < itemValues.length; j++) {
          valuesSql += `$${paramCounter++}`;
          if (j < itemValues.length - 1) valuesSql += ', ';
          params.push(itemValues[j]);
        }
        valuesSql += ')';
        if (i < values.length - 1) valuesSql += ', ';
      }
      
      const sql = `INSERT INTO ${table} (${columns}) VALUES ${valuesSql} RETURNING *`;
      return await query(sql, params);
    },
    update: async (values) => ({
      eq: async (column, value) => {
        const setEntries = Object.entries(values)
          .map(([key, _], i) => `${key} = $${i + 1}`)
          .join(', ');
        const params = [...Object.values(values), value];
        
        return await query(
          `UPDATE ${table} SET ${setEntries} WHERE ${column} = $${params.length} RETURNING *`,
          params
        );
      }
    }),
    delete: async () => ({
      eq: async (column, value) => {
        return await query(`DELETE FROM ${table} WHERE ${column} = $1`, [value]);
      }
    }),
    select: async (columns = '*') => ({
      order: async (column, { ascending = true } = {}) => {
        return await query(
          `SELECT ${columns} FROM ${table} ORDER BY ${column} ${ascending ? 'ASC' : 'DESC'}`
        );
      }
    }),
    eq: async (column, value) => {
      return await query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value]);
    },
    maybeSingle: async () => {
      const result = await query(`SELECT * FROM ${table} LIMIT 1`);
      return {
        data: result.data?.[0] || null,
        error: result.error
      };
    },
    limit: async (limit) => {
      return await query(`SELECT * FROM ${table} LIMIT ${limit}`);
    },
    single: async () => {
      const result = await query(`SELECT * FROM ${table} LIMIT 1`);
      return {
        data: result.data?.[0],
        error: result.error || (!result.data?.[0] ? new Error('No rows found') : null)
      };
    },
    overlaps: async (column, values) => {
      // Implement overlaps as a simple filter that checks if array columns have overlap
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      return await query(`SELECT * FROM ${table} WHERE ${column} && ARRAY[${placeholders}]`, values);
    },
    order: async (column, { ascending = true } = {}) => {
      return await query(
        `SELECT * FROM ${table} ORDER BY ${column} ${ascending ? 'ASC' : 'DESC'}`
      );
    }
  }),
  // Implement a simplified auth system
  auth: {
    getUser: async (token) => {
      // For demonstration - you would implement proper token verification
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decoded || !decoded.userId) {
          return { data: { user: null }, error: new Error('Invalid token') };
        }
        
        const result = await query('SELECT * FROM profiles WHERE id = $1', [decoded.userId]);
        return { data: { user: result.data?.[0] || null }, error: result.error };
      } catch (error) {
        return { data: { user: null }, error };
      }
    }
  }
};

// Export for backward compatibility
module.exports = supabase;

// Test function for backward compatibility
module.exports.testConnection = async () => {
  try {
    const { data, error } = await query('SELECT NOW()');
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    console.log('Database connection successful!');
    return true;
  } catch (err) {
    console.error('Unexpected error testing database connection:', err);
    return false;
  }
};
