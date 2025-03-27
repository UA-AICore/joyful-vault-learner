
const express = require('express');
const { activitiesController } = require('../controllers/activities.controller');
const router = express.Router();

/**
 * @route GET /api/activities
 * @desc Get all activities
 */
router.get('/', activitiesController.getAllActivities);

/**
 * @route GET /api/activities/:id
 * @desc Get a single activity by ID
 */
router.get('/:id', activitiesController.getActivityById);

/**
 * @route POST /api/activities
 * @desc Create a new activity
 */
router.post('/', activitiesController.createActivity);

/**
 * @route PUT /api/activities/:id
 * @desc Update an activity
 */
router.put('/:id', activitiesController.updateActivity);

/**
 * @route DELETE /api/activities/:id
 * @desc Delete an activity
 */
router.delete('/:id', activitiesController.deleteActivity);

module.exports = router;
