const Joi = require('joi');
const { db } = require('../db/database');

// Validation schema for category
const categorySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required()
});

// Category model
class CategoryModel {
  // Get all categories
  static getAll() {
    return db.categories;
  }
  
  // Get category by ID
  static getById(id) {
    const category = db.categories.find(c => c.id === id);
    if (!category) {
      const error = new Error(`Category with ID ${id} not found`);
      error.name = 'NotFoundError';
      throw error;
    }
    return category;
  }
  
  // Create new category
  static create(data) {
    // Validate data
    const { error, value } = categorySchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Create new category
    const newCategory = {
      id: db.categoryIdCounter++,
      ...value
    };
    
    db.categories.push(newCategory);
    return newCategory;
  }
  
  // Update category
  static update(id, data) {
    // Validate data
    const { error, value } = categorySchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Check if category exists
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Category with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Update category
    const updatedCategory = {
      id,
      ...value
    };
    
    db.categories[index] = updatedCategory;
    return updatedCategory;
  }
  
  // Delete category
  static delete(id) {
    // Check if category exists
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Category with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Check if category is used by any shop items
    const isUsed = db.shopItems.some(item => item.categoryIds.includes(id));
    if (isUsed) {
      const validationError = new Error(`Cannot delete category with ID ${id} because it is used by shop items`);
      validationError.name = 'ValidationError';
      throw validationError;
    }
    
    // Delete category
    db.categories.splice(index, 1);
    return { success: true, message: `Category with ID ${id} deleted successfully` };
  }
}

module.exports = CategoryModel;