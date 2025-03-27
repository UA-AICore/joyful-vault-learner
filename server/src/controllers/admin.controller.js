
const { adminService } = require('../services/admin.service');

/**
 * Admin controller - handles admin-related request/response logic
 */
const adminController = {
  // Categories management
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await adminService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },
  
  createCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Category name is required'
        });
      }
      
      const newCategory = await adminService.createCategory(name);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },
  
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await adminService.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Category with ID ${id} not found`
        });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  
  // Materials management
  getAllMaterials: async (req, res, next) => {
    try {
      const materials = await adminService.getAllMaterials();
      res.status(200).json(materials);
    } catch (error) {
      next(error);
    }
  },
  
  createMaterial: async (req, res, next) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Material name is required'
        });
      }
      
      const newMaterial = await adminService.createMaterial(name);
      res.status(201).json(newMaterial);
    } catch (error) {
      next(error);
    }
  },
  
  deleteMaterial: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await adminService.deleteMaterial(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Material with ID ${id} not found`
        });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { adminController };
