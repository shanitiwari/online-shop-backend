const Joi = require('joi');
const { db } = require('../db/database');

// Validation schema for shop item
const shopItemSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
  categoryIds: Joi.array().items(Joi.number().integer().positive()).min(1).required()
});

// Shop item model
class ShopItemModel {
  // Get all shop items
  static getAll() {
    const shopItems = Array.isArray(db.shopItems) ? db.shopItems : [];
    const categories = Array.isArray(db.categories) ? db.categories : [];
    return shopItems.map(item => {
      // Get categories for each item
      const itemCategories = Array.isArray(item.categoryIds)
        ? item.categoryIds.map(categoryId => {
            return categories.find(c => c.id === categoryId);
          }).filter(Boolean)
        : [];
      return {
        ...item,
        categories: itemCategories
      };
    });
  }
  
  // Get shop item by ID
  static getById(id) {
    const shopItems = Array.isArray(db.shopItems) ? db.shopItems : [];
    const categories = Array.isArray(db.categories) ? db.categories : [];
    const shopItem = shopItems.find(i => i.id === id);
    if (!shopItem) {
      const error = new Error(`Shop item with ID ${id} not found`);
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Get categories for the item
    const itemCategories = Array.isArray(shopItem.categoryIds)
      ? shopItem.categoryIds.map(categoryId => {
          return categories.find(c => c.id === categoryId);
        }).filter(Boolean)
      : [];
    
    return {
      ...shopItem,
      categories: itemCategories
    };
  }
  
  // Create new shop item
  static create(data) {
    // Validate data
    const { error, value } = shopItemSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Validate categoryIds
    for (const categoryId of value.categoryIds) {
      const category = db.categories.find(c => c.id === categoryId);
      if (!category) {
        const validationError = new Error(`Category with ID ${categoryId} not found`);
        validationError.name = 'ValidationError';
        throw validationError;
      }
    }
    
    // Create new shop item
    const newShopItem = {
      id: db.shopItemIdCounter++,
      title: value.title,
      description: value.description,
      price: value.price,
      categoryIds: value.categoryIds
    };
    
    db.shopItems.push(newShopItem);
    
    // Get categories for response
    const categories = newShopItem.categoryIds.map(categoryId => {
      return db.categories.find(c => c.id === categoryId);
    }).filter(Boolean);
    
    return {
      ...newShopItem,
      categories
    };
  }
  
  // Update shop item
  static update(id, data) {
    // Validate data
    const { error, value } = shopItemSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Check if shop item exists
    const index = db.shopItems.findIndex(i => i.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Shop item with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Validate categoryIds
    for (const categoryId of value.categoryIds) {
      const category = db.categories.find(c => c.id === categoryId);
      if (!category) {
        const validationError = new Error(`Category with ID ${categoryId} not found`);
        validationError.name = 'ValidationError';
        throw validationError;
      }
    }
    
    // Update shop item
    const updatedShopItem = {
      id,
      title: value.title,
      description: value.description,
      price: value.price,
      categoryIds: value.categoryIds
    };
    
    db.shopItems[index] = updatedShopItem;
    
    // Get categories for response
    const categories = updatedShopItem.categoryIds.map(categoryId => {
      return db.categories.find(c => c.id === categoryId);
    }).filter(Boolean);
    
    return {
      ...updatedShopItem,
      categories
    };
  }
  
  // Delete shop item
  static delete(id) {
    // Check if shop item exists
    const index = db.shopItems.findIndex(i => i.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Shop item with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Check if shop item is used in any orders
    const isUsed = db.orders.some(order => 
      order.items.some(item => item.shopItemId === id)
    );
    
    if (isUsed) {
      const validationError = new Error(`Cannot delete shop item with ID ${id} because it is used in orders`);
      validationError.name = 'ValidationError';
      throw validationError;
    }
    
    // Delete shop item
    db.shopItems.splice(index, 1);
    return { success: true, message: `Shop item with ID ${id} deleted successfully` };
  }
}

module.exports = ShopItemModel;