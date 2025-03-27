
const express = require('express');
const { adminController } = require('../controllers/admin.controller');
const { adminAuth } = require('../middleware/adminAuth');
const router = express.Router();

// Apply admin middleware to all routes in this router
router.use(adminAuth);

// Categories endpoints
/**
 * @route GET /api/admin/categories
 * @desc Get all categories
 */
router.get('/categories', adminController.getAllCategories);

/**
 * @route POST /api/admin/categories
 * @desc Create a new category
 */
router.post('/categories', adminController.createCategory);

/**
 * @route DELETE /api/admin/categories/:id
 * @desc Delete a category
 */
router.delete('/categories/:id', adminController.deleteCategory);

// Materials endpoints
/**
 * @route GET /api/admin/materials
 * @desc Get all materials
 */
router.get('/materials', adminController.getAllMaterials);

/**
 * @route POST /api/admin/materials
 * @desc Create a new material
 */
router.post('/materials', adminController.createMaterial);

/**
 * @route DELETE /api/admin/materials/:id
 * @desc Delete a material
 */
router.delete('/materials/:id', adminController.deleteMaterial);

module.exports = router;
