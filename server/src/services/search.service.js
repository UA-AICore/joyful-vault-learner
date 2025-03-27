
const supabase = require('../config/supabase');

/**
 * Search service - handles database search operations
 */
const searchService = {
  /**
   * Search activities based on filters
   * @param {Object} filters - Object with categories, materials, target_words arrays
   * @returns {Array} - Array of matching activities
   */
  searchActivities: async (filters) => {
    const { categories, materials, target_words } = filters;
    
    // Start with a base query
    let query = supabase
      .from('activities')
      .select('*');
    
    // Count the number of active filters
    const filterCount = [categories, materials, target_words].filter(Boolean).length;
    
    // Apply filters based on the AND/OR logic rule:
    // - If multiple filter types (e.g. categories AND materials): use AND between filter types
    // - If only one filter type (e.g. only categories): use OR within that filter type
    
    if (filterCount > 1) {
      // Multiple filter types: use AND logic between different filter types
      if (categories && categories.length > 0) {
        // Overlap - at least one category must match
        query = query.overlaps('categories', categories);
      }
      
      if (materials && materials.length > 0) {
        // Overlap - at least one material must match
        query = query.overlaps('materials', materials);
      }
      
      if (target_words && target_words.length > 0) {
        // Overlap - at least one target word must match
        query = query.overlaps('target_words', target_words);
      }
    } else {
      // Single filter type: use OR logic within that filter type
      if (categories && categories.length > 0) {
        query = query.overlaps('categories', categories);
      } else if (materials && materials.length > 0) {
        query = query.overlaps('materials', materials);
      } else if (target_words && target_words.length > 0) {
        query = query.overlaps('target_words', target_words);
      }
    }
    
    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

module.exports = { searchService };
