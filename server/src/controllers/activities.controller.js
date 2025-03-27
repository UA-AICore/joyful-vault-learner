
const { activitiesService } = require('../services/activities.service');

/**
 * Activities controller - handles activity-related request/response logic
 */
const activitiesController = {
  /**
   * Get all activities
   */
  getAllActivities: async (req, res, next) => {
    try {
      const activities = await activitiesService.getAllActivities();
      res.status(200).json(activities);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single activity by ID
   */
  getActivityById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const activity = await activitiesService.getActivityById(id);
      
      if (!activity) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Activity with ID ${id} not found`
        });
      }
      
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new activity
   */
  createActivity: async (req, res, next) => {
    try {
      // Validate required fields
      const { title, description, target_words, categories } = req.body;
      
      if (!title || !description || !target_words || !categories) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields'
        });
      }
      
      const newActivity = await activitiesService.createActivity(req.body);
      res.status(201).json(newActivity);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an activity
   */
  updateActivity: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedActivity = await activitiesService.updateActivity(id, req.body);
      
      if (!updatedActivity) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Activity with ID ${id} not found`
        });
      }
      
      res.status(200).json(updatedActivity);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an activity
   */
  deleteActivity: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await activitiesService.deleteActivity(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Activity with ID ${id} not found`
        });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { activitiesController };
