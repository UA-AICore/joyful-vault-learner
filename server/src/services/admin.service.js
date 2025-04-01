
const { query } = require('../config/db');

/**
 * Admin service - handles database operations for admin functions
 */
const adminService = {
  // Categories management
  getAllCategories: async () => {
    const { data, error } = await query(
      'SELECT * FROM categories ORDER BY name'
    );
    
    if (error) throw error;
    return data;
  },
  
  createCategory: async (name) => {
    const { data, error } = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    if (error) throw error;
    return data[0];
  },
  
  deleteCategory: async (id) => {
    // First check if the category exists
    const { data: existingCategory } = await query(
      'SELECT id FROM categories WHERE id = $1',
      [id]
    );
    
    if (!existingCategory || existingCategory.length === 0) return false;
    
    const { error } = await query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );
    
    if (error) throw error;
    return true;
  },
  
  // Materials management
  getAllMaterials: async () => {
    const { data, error } = await query(
      'SELECT * FROM materials ORDER BY name'
    );
    
    if (error) throw error;
    return data;
  },
  
  createMaterial: async (name) => {
    const { data, error } = await query(
      'INSERT INTO materials (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    if (error) throw error;
    return data[0];
  },
  
  deleteMaterial: async (id) => {
    // First check if the material exists
    const { data: existingMaterial } = await query(
      'SELECT id FROM materials WHERE id = $1',
      [id]
    );
    
    if (!existingMaterial || existingMaterial.length === 0) return false;
    
    const { error } = await query(
      'DELETE FROM materials WHERE id = $1',
      [id]
    );
    
    if (error) throw error;
    return true;
  }
};

module.exports = { adminService };
