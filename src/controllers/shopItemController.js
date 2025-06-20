const ShopItemModel = require('../models/shopItemModel');

// Shop item controller
const shopItemController = {
  // Get all shop items
  getAll: (req, res, next) => {
    try {
      const shopItems = ShopItemModel.getAll();
      res.status(200).json(shopItems);
    } catch (error) {
      next(error);
    }
  },
  
  // Get shop item by ID
  getById: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Shop item ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const shopItem = ShopItemModel.getById(id);
      res.status(200).json(shopItem);
    } catch (error) {
      next(error);
    }
  },
  
  // Create shop item
  create: (req, res, next) => {
    try {
      const newShopItem = ShopItemModel.create(req.body);
      res.status(201).json(newShopItem);
    } catch (error) {
      next(error);
    }
  },
  
  // Update shop item
  update: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Shop item ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const updatedShopItem = ShopItemModel.update(id, req.body);
      res.status(200).json(updatedShopItem);
    } catch (error) {
      next(error);
    }
  },
  
  // Delete shop item
  delete: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Shop item ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const result = ShopItemModel.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = shopItemController;