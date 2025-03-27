
const supabase = require('../config/supabase');

/**
 * Admin service - handles database operations for admin functions
 * This handles category and material management
 */
const adminService = {
  // Categories management
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  createCategory: async (name) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  deleteCategory: async (id) => {
    // First check if the category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingCategory) return false;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Materials management
  getAllMaterials: async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  createMaterial: async (name) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([{ name }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  deleteMaterial: async (id) => {
    // First check if the material exists
    const { data: existingMaterial } = await supabase
      .from('materials')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingMaterial) return false;
    
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

module.exports = { adminService };
