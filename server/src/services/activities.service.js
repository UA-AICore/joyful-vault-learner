
const supabase = require('../config/supabase');

/**
 * Activities service - handles database operations for activities
 */
const activitiesService = {
  /**
   * Get all activities
   */
  getAllActivities: async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a single activity by ID
   */
  getActivityById: async (id) => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "not found" error
    return data;
  },

  /**
   * Create a new activity
   */
  createActivity: async (activityData) => {
    // Ensure all required fields have proper types
    const activity = {
      title: activityData.title,
      description: activityData.description,
      target_words: Array.isArray(activityData.target_words) 
        ? activityData.target_words 
        : [],
      target_sentences: activityData.target_sentences || {},
      categories: Array.isArray(activityData.categories) 
        ? activityData.categories 
        : [],
      materials: Array.isArray(activityData.materials) 
        ? activityData.materials 
        : [],
      video_url: activityData.video_url || null,
      image_url: activityData.image_url || null,
      status: activityData.status || 'Draft',
      color: activityData.color || '#4285F4' // Default color if not provided
    };

    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  /**
   * Update an activity
   */
  updateActivity: async (id, activityData) => {
    // First check if the activity exists
    const { data: existingActivity } = await supabase
      .from('activities')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingActivity) return null;
    
    // Only update fields that are provided
    const updates = {};
    
    if (activityData.title !== undefined) updates.title = activityData.title;
    if (activityData.description !== undefined) updates.description = activityData.description;
    if (activityData.target_words !== undefined) updates.target_words = activityData.target_words;
    if (activityData.target_sentences !== undefined) updates.target_sentences = activityData.target_sentences;
    if (activityData.categories !== undefined) updates.categories = activityData.categories;
    if (activityData.materials !== undefined) updates.materials = activityData.materials;
    if (activityData.video_url !== undefined) updates.video_url = activityData.video_url;
    if (activityData.image_url !== undefined) updates.image_url = activityData.image_url;
    if (activityData.status !== undefined) updates.status = activityData.status;
    if (activityData.color !== undefined) updates.color = activityData.color;
    
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  /**
   * Delete an activity
   */
  deleteActivity: async (id) => {
    // First check if the activity exists
    const { data: existingActivity } = await supabase
      .from('activities')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingActivity) return false;
    
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

module.exports = { activitiesService };
