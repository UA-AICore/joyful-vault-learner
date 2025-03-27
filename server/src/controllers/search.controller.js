
const { searchService } = require('../services/search.service');

/**
 * Search controller - handles search request/response logic
 */
const searchController = {
  /**
   * Search activities by filters
   * Supports category, material, and target_words filters
   * - If multiple filters: applies AND logic
   * - If single filter: applies OR logic within that filter
   */
  searchActivities: async (req, res, next) => {
    try {
      const { categories, materials, target_words } = req.body;
      
      // Check if at least one filter is provided
      if (!categories && !materials && !target_words) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'At least one search filter is required'
        });
      }
      
      const results = await searchService.searchActivities({
        categories,
        materials,
        target_words
      });
      
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { searchController };
