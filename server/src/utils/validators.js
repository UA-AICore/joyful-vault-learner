
/**
 * Utility functions for validating data
 */

/**
 * Validates an activity object
 * @param {Object} activity - The activity to validate
 * @returns {Object} - { isValid, errors }
 */
const validateActivity = (activity) => {
  const errors = [];

  // Check required fields
  if (!activity.title) errors.push('Title is required');
  if (!activity.description) errors.push('Description is required');
  
  // Check array fields
  if (!Array.isArray(activity.target_words)) {
    errors.push('Target words must be an array');
  } else if (activity.target_words.length === 0) {
    errors.push('At least one target word is required');
  }
  
  if (!Array.isArray(activity.categories)) {
    errors.push('Categories must be an array');
  } else if (activity.categories.length === 0) {
    errors.push('At least one category is required');
  }
  
  // Check status
  if (activity.status && !['Active', 'Draft'].includes(activity.status)) {
    errors.push('Status must be either "Active" or "Draft"');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateActivity
};
