const Joi = require('joi');
const { db } = require('../db/database');

// Validation schema for order item
const orderItemSchema = Joi.object({
  shopItemId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required()
});

// Validation schema for order
const orderSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  items: Joi.array().items(orderItemSchema).min(1).required()
});

// Order model
class OrderModel {
  // Get all orders
  static getAll() {
    return db.orders.map(order => {
      // Get customer
      const customer = db.customers.find(c => c.id === order.customerId);
      
      // Get items with details
      const items = order.items.map(item => {
        const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
        return {
          id: item.id,
          quantity: item.quantity,
          shopItem: shopItem ? {
            id: shopItem.id,
            title: shopItem.title,
            price: shopItem.price,
            description: shopItem.description
          } : null
        };
      });
      
      return {
        id: order.id,
        customer,
        items
      };
    });
  }
  
  // Get order by ID
  static getById(id) {
    const order = db.orders.find(o => o.id === id);
    if (!order) {
      const error = new Error(`Order with ID ${id} not found`);
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Get customer
    const customer = db.customers.find(c => c.id === order.customerId);
    
    // Get items with details
    const items = order.items.map(item => {
      const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
      return {
        id: item.id,
        quantity: item.quantity,
        shopItem: shopItem ? {
          id: shopItem.id,
          title: shopItem.title,
          price: shopItem.price,
          description: shopItem.description
        } : null
      };
    });
    
    return {
      id: order.id,
      customer,
      items
    };
  }
  
  // Create new order
  static create(data) {
    // Validate data
    const { error, value } = orderSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Validate customer
    const customer = db.customers.find(c => c.id === value.customerId);
    if (!customer) {
      const validationError = new Error(`Customer with ID ${value.customerId} not found`);
      validationError.name = 'ValidationError';
      throw validationError;
    }
    
    // Validate shop items
    for (const item of value.items) {
      const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
      if (!shopItem) {
        const validationError = new Error(`Shop item with ID ${item.shopItemId} not found`);
        validationError.name = 'ValidationError';
        throw validationError;
      }
    }
    
    // Create order items with IDs
    const items = value.items.map(item => ({
      id: db.orderItemIdCounter++,
      shopItemId: item.shopItemId,
      quantity: item.quantity
    }));
    
    // Create new order
    const newOrder = {
      id: db.orderIdCounter++,
      customerId: value.customerId,
      items
    };
    
    db.orders.push(newOrder);
    
    // Format response
    const itemsWithDetails = newOrder.items.map(item => {
      const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
      return {
        id: item.id,
        quantity: item.quantity,
        shopItem: {
          id: shopItem.id,
          title: shopItem.title,
          price: shopItem.price,
          description: shopItem.description
        }
      };
    });
    
    return {
      id: newOrder.id,
      customer,
      items: itemsWithDetails
    };
  }
  
  // Update order
  static update(id, data) {
    // Validate data
    const { error, value } = orderSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Check if order exists
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Order with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Validate customer
    const customer = db.customers.find(c => c.id === value.customerId);
    if (!customer) {
      const validationError = new Error(`Customer with ID ${value.customerId} not found`);
      validationError.name = 'ValidationError';
      throw validationError;
    }
    
    // Validate shop items
    for (const item of value.items) {
      const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
      if (!shopItem) {
        const validationError = new Error(`Shop item with ID ${item.shopItemId} not found`);
        validationError.name = 'ValidationError';
        throw validationError;
      }
    }
    
    // Create order items with IDs
    const items = value.items.map(item => ({
      id: db.orderItemIdCounter++,
      shopItemId: item.shopItemId,
      quantity: item.quantity
    }));
    
    // Update order
    const updatedOrder = {
      id,
      customerId: value.customerId,
      items
    };
    
    db.orders[index] = updatedOrder;
    
    // Format response
    const itemsWithDetails = updatedOrder.items.map(item => {
      const shopItem = db.shopItems.find(i => i.id === item.shopItemId);
      return {
        id: item.id,
        quantity: item.quantity,
        shopItem: {
          id: shopItem.id,
          title: shopItem.title,
          price: shopItem.price,
          description: shopItem.description
        }
      };
    });
    
    return {
      id: updatedOrder.id,
      customer,
      items: itemsWithDetails
    };
  }
  
  // Delete order
  static delete(id) {
    // Check if order exists
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Order with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Delete order
    db.orders.splice(index, 1);
    return { success: true, message: `Order with ID ${id} deleted successfully` };
  }
}

module.exports = OrderModel;