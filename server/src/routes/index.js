
const express = require('express');
const activitiesRoutes = require('./activities.routes');
const searchRoutes = require('./search.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

// Register all route groups
router.use('/activities', activitiesRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
