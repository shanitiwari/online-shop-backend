const { TestData } = require('./utils/testHelpers');

describe('Customer API Endpoints', () => {

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      await testHelpers.testGetAll('/api/customers', ['name', 'surname', 'email']);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by ID', async () => {
      await testHelpers.testGetById('/api/customers', 1, ['name', 'surname', 'email']);
    });

    it('should return 404 for non-existent customer', async () => {
      await testHelpers.testGetByIdNotFound('/api/customers');
    });

    it('should return 400 for invalid ID format', async () => {
      await testHelpers.testGetByIdInvalidFormat('/api/customers');
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      await testHelpers.testCreate('/api/customers', TestData.customer.valid());
    });

    it('should return 400 for missing required fields', async () => {
      await testHelpers.testCreateValidationError('/api/customers', TestData.customer.invalid.missingFields());
    });

    it('should return 400 for invalid email format', async () => {
      await testHelpers.testCreateValidationError('/api/customers', TestData.customer.invalid.invalidEmail());
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update an existing customer', async () => {
      await testHelpers.testUpdate('/api/customers', 1, TestData.customer.update());
    });

    it('should return 404 for non-existent customer', async () => {
      await testHelpers.testUpdateNotFound('/api/customers', 999, TestData.customer.update());
    });

    it('should return 400 for invalid data', async () => {
      await testHelpers.testUpdateValidationError('/api/customers', 1, TestData.customer.invalid.missingFields());
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should delete an existing customer', async () => {
      // Create a customer to delete using helper
      const customerId = await testHelpers.createTestItem('/api/customers', TestData.customer.valid());
      
      // Test deletion
      await testHelpers.testDelete('/api/customers', customerId);
      
      // Verify customer is deleted
      await testHelpers.testGetByIdNotFound('/api/customers', customerId);
    });

    it('should return 404 for non-existent customer', async () => {
      await testHelpers.testDeleteNotFound('/api/customers');
    });

    it('should return 400 for customer with orders', async () => {
      // Create an order for the first customer using test data
      const order = TestData.order.valid();
      await testHelpers.createTestItem('/api/orders', order);
      
      // Try to delete the customer - should fail due to business rule
      const request = require('supertest');
      const res = await request(testApp).delete('/api/customers/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});