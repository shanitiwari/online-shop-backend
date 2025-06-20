const CategoryModel = require('../models/categoryModel');

// Category controller
const categoryController = {
  // Get all categories
  getAll: (req, res, next) => {
    try {
      const categories = CategoryModel.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },
  
  // Get category by ID
  getById: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Category ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const category = CategoryModel.getById(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },
  
  // Create category
  create: (req, res, next) => {
    try {
      const newCategory = CategoryModel.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },
  
  // Update category
  update: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Category ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const updatedCategory = CategoryModel.update(id, req.body);
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },
  
  // Delete category
  delete: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Category ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const result = CategoryModel.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;