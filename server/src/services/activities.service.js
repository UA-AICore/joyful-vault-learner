
const { query } = require('../config/db');

/**
 * Activities service - handles database operations for activities
 */
const activitiesService = {
  /**
   * Get all activities
   */
  getAllActivities: async () => {
    try {
      const { data, error } = await query(
        'SELECT * FROM activities ORDER BY created_at DESC'
      );
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error in getAllActivities:', error);
      throw error;
    }
  },

  /**
   * Get a single activity by ID
   */
  getActivityById: async (id) => {
    try {
      const { data, error } = await query(
        'SELECT * FROM activities WHERE id = $1',
        [id]
      );
      
      if (error) {
        console.error('Error fetching activity by ID:', error);
        throw error;
      }
      return data?.[0] || null;
    } catch (error) {
      console.error('Unexpected error in getActivityById:', error);
      throw error;
    }
  },

  /**
   * Create a new activity
   */
  createActivity: async (activityData) => {
    try {
      // Convert JavaScript objects to PostgreSQL JSON
      const activity = {
        ...activityData,
        target_words: JSON.stringify(activityData.target_words || []),
        target_sentences: JSON.stringify(activityData.target_sentences || {}),
        categories: JSON.stringify(activityData.categories || []),
        materials: JSON.stringify(activityData.materials || [])
      };

      const columns = Object.keys(activity).join(', ');
      const placeholders = Object.keys(activity).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(activity);

      const { data, error } = await query(
        `INSERT INTO activities (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      
      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }
      return data?.[0];
    } catch (error) {
      console.error('Unexpected error in createActivity:', error);
      throw error;
    }
  },

  /**
   * Update an activity
   */
  updateActivity: async (id, activityData) => {
    try {
      // First check if the activity exists
      const { data: existingActivity } = await query(
        'SELECT id FROM activities WHERE id = $1',
        [id]
      );
      
      if (!existingActivity || existingActivity.length === 0) return null;
      
      // Process arrays and objects for PostgreSQL
      const updates = { ...activityData };
      if (updates.target_words !== undefined) updates.target_words = JSON.stringify(updates.target_words);
      if (updates.target_sentences !== undefined) updates.target_sentences = JSON.stringify(updates.target_sentences);
      if (updates.categories !== undefined) updates.categories = JSON.stringify(updates.categories);
      if (updates.materials !== undefined) updates.materials = JSON.stringify(updates.materials);
      
      // Add updated_at timestamp
      updates.updated_at = new Date().toISOString();
      
      // Build the SET clause and params
      const setEntries = Object.entries(updates)
        .map(([key, _], i) => `${key} = $${i + 1}`)
        .join(', ');
      const params = [...Object.values(updates), id];
      
      const { data, error } = await query(
        `UPDATE activities SET ${setEntries} WHERE id = $${params.length} RETURNING *`,
        params
      );
      
      if (error) {
        console.error('Error updating activity:', error);
        throw error;
      }
      return data?.[0];
    } catch (error) {
      console.error('Unexpected error in updateActivity:', error);
      throw error;
    }
  },

  /**
   * Delete an activity
   */
  deleteActivity: async (id) => {
    try {
      // First check if the activity exists
      const { data: existingActivity } = await query(
        'SELECT id FROM activities WHERE id = $1',
        [id]
      );
      
      if (!existingActivity || existingActivity.length === 0) return false;
      
      const { error } = await query(
        'DELETE FROM activities WHERE id = $1',
        [id]
      );
      
      if (error) {
        console.error('Error deleting activity:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error in deleteActivity:', error);
      throw error;
    }
  }
};

module.exports = { activitiesService };
