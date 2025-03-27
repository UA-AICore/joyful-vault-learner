
const express = require('express');
const { searchController } = require('../controllers/search.controller');
const router = express.Router();

/**
 * @route POST /api/search
 * @desc Search activities by filters (category, material, target words)
 */
router.post('/', searchController.searchActivities);

module.exports = router;
