
const { query } = require('../config/db');

/**
 * Search service - handles database search operations
 */
const searchService = {
  /**
   * Search activities based on filters
   */
  searchActivities: async (filters) => {
    const { categories, materials, target_words } = filters;
    
    try {
      let sqlQuery = 'SELECT * FROM activities';
      let whereClauses = [];
      let params = [];
      let paramIndex = 1;
      
      // Count the number of active filters
      const filterCount = [categories, materials, target_words].filter(Boolean).filter(f => f.length > 0).length;
      
      // Apply filters
      if (filterCount > 0) {
        // Start WHERE clause
        sqlQuery += ' WHERE ';
        
        // Add category filter if provided
        if (categories && categories.length > 0) {
          const categoryParams = [];
          for (const category of categories) {
            params.push(category);
            categoryParams.push(`$${paramIndex++}`);
          }
          whereClauses.push(`categories && ARRAY[${categoryParams.join(', ')}]::text[]`);
        }
        
        // Add materials filter if provided
        if (materials && materials.length > 0) {
          const materialParams = [];
          for (const material of materials) {
            params.push(material);
            materialParams.push(`$${paramIndex++}`);
          }
          whereClauses.push(`materials && ARRAY[${materialParams.join(', ')}]::text[]`);
        }
        
        // Add target words filter if provided
        if (target_words && target_words.length > 0) {
          const wordParams = [];
          for (const word of target_words) {
            params.push(word);
            wordParams.push(`$${paramIndex++}`);
          }
          whereClauses.push(`target_words && ARRAY[${wordParams.join(', ')}]::text[]`);
        }
        
        // Join WHERE clauses based on filter count
        if (filterCount > 1) {
          // Multiple filter types: use AND logic
          sqlQuery += whereClauses.join(' AND ');
        } else {
          // Single filter type: use OR logic within that filter
          sqlQuery += whereClauses.join(' OR ');
        }
      }
      
      // Add order by
      sqlQuery += ' ORDER BY created_at DESC';
      
      // Execute query
      const { data, error } = await query(sqlQuery, params);
      
      if (error) {
        console.error('Error in search query:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error in searchActivities:', error);
      throw error;
    }
  }
};

module.exports = { searchService };
