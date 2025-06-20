const CustomerModel = require('../models/customerModel');

// Customer controller
const customerController = {
  // Get all customers
  getAll: (req, res, next) => {
    try {
      const customers = CustomerModel.getAll();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  },
  
  // Get customer by ID
  getById: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Customer ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const customer = CustomerModel.getById(id);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  },
  
  // Create customer
  create: (req, res, next) => {
    try {
      const newCustomer = CustomerModel.create(req.body);
      res.status(201).json(newCustomer);
    } catch (error) {
      next(error);
    }
  },
  
  // Update customer
  update: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Customer ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const updatedCustomer = CustomerModel.update(id, req.body);
      res.status(200).json(updatedCustomer);
    } catch (error) {
      next(error);
    }
  },
  
  // Delete customer
  delete: (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new Error('Customer ID must be a number');
        error.name = 'ValidationError';
        throw error;
      }
      
      const result = CustomerModel.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;