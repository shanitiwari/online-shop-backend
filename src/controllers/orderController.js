const OrderModel = require('../models/orderModel');

// Order controller
const orderController = {
  // Get all orders
  getAll: (req, res, next) => {
    try {
      const orders = OrderModel.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  
  // Get order by ID
  getById: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Order ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const order = OrderModel.getById(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  
  // Create order
  create: (req, res, next) => {
    try {
      const newOrder = OrderModel.create(req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  },
  
  // Update order
  update: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Order ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const updatedOrder = OrderModel.update(id, req.body);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
  
  // Delete order
  delete: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Order ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const result = OrderModel.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;