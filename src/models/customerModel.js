const Joi = require('joi');
const { db } = require('../db/database');

// Validation schema for customer
const customerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required()
});

// Customer model
class CustomerModel {
  // Get all customers
  static getAll() {
    return db.customers;
  }
  
  // Get customer by ID
  static getById(id) {
    const customer = db.customers.find(c => c.id === id);
    if (!customer) {
      const error = new Error(`Customer with ID ${id} not found`);
      error.name = 'NotFoundError';
      throw error;
    }
    return customer;
  }
  
  // Create new customer
  static create(data) {
    // Validate data
    const { error, value } = customerSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Create new customer
    const newCustomer = {
      id: db.customerIdCounter++,
      ...value
    };
    
    db.customers.push(newCustomer);
    return newCustomer;
  }
  
  // Update customer
  static update(id, data) {
    // Validate data
    const { error, value } = customerSchema.validate(data);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      throw validationError;
    }
    
    // Check if customer exists
    const index = db.customers.findIndex(c => c.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Customer with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Update customer
    const updatedCustomer = {
      id,
      ...value
    };
    
    db.customers[index] = updatedCustomer;
    return updatedCustomer;
  }
  
  // Delete customer
  static delete(id) {
    // Check if customer exists
    const index = db.customers.findIndex(c => c.id === id);
    if (index === -1) {
      const notFoundError = new Error(`Customer with ID ${id} not found`);
      notFoundError.name = 'NotFoundError';
      throw notFoundError;
    }
    
    // Check if customer has any orders
    const hasOrders = db.orders.some(order => order.customerId === id);
    if (hasOrders) {
      const validationError = new Error(`Cannot delete customer with ID ${id} because they have orders`);
      validationError.name = 'ValidationError';
      throw validationError;
    }
    
    // Delete customer
    db.customers.splice(index, 1);
    return { success: true, message: `Customer with ID ${id} deleted successfully` };
  }
}

module.exports = CustomerModel;