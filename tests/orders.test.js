const { TestData } = require('./utils/testHelpers');

describe('Order API Endpoints', () => {

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // First create an order to ensure there's at least one
      await testHelpers.createTestItem('/api/orders', TestData.order.valid());
      
      const res = await testHelpers.testGetAll('/api/orders', ['customer', 'items']);
      
      // Verify order has customer and items with proper structure
      expect(Array.isArray(res.body[0].items)).toBeTruthy();
      expect(res.body[0].items[0]).toHaveProperty('shopItem');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return an order by ID', async () => {
      // First create an order to get its ID
      const orderId = await testHelpers.createTestItem('/api/orders', TestData.order.valid());

      const res = await testHelpers.testGetById('/api/orders', orderId, ['customer', 'items']);
      
      expect(res.body.customer).toHaveProperty('id', 1);
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', 1);
      expect(res.body.items[0]).toHaveProperty('quantity', 2);
    });

    it('should return 404 for non-existent order', async () => {
      await testHelpers.testGetByIdNotFound('/api/orders');
    });

    it('should return 400 for invalid ID format', async () => {
      await testHelpers.testGetByIdInvalidFormat('/api/orders');
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const res = await testHelpers.testCreate('/api/orders', TestData.order.withMultipleItems());
      
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('id', 2);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(2);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', 1);
      expect(res.body.items[0]).toHaveProperty('quantity', 1);
    });

    it('should return 400 for missing required fields', async () => {
      await testHelpers.testCreateValidationError('/api/orders', TestData.order.invalid.missingCustomer());
    });

    it('should return 400 for invalid customer ID', async () => {
      await testHelpers.testCreateValidationError('/api/orders', TestData.order.invalid.invalidCustomer());
    });

    it('should return 400 for invalid shop item ID', async () => {
      await testHelpers.testCreateValidationError('/api/orders', TestData.order.invalid.invalidShopItem());
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update an existing order', async () => {
      // First create an order to update
      const orderId = await testHelpers.createTestItem('/api/orders', TestData.order.valid());

      const res = await testHelpers.testUpdate('/api/orders', orderId, TestData.order.update());
      
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('id', 2);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', 2);
      expect(res.body.items[0]).toHaveProperty('quantity', 1);
    });

    it('should return 404 for non-existent order', async () => {
      await testHelpers.testUpdateNotFound('/api/orders', 999, TestData.order.update());
    });

    it('should return 400 for invalid data', async () => {
      // First create an order to update
      const orderId = await testHelpers.createTestItem('/api/orders', TestData.order.valid());

      const invalidData = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: -5 // Invalid quantity
          }
        ]
      };

      const request = require('supertest');
      const res = await request(testApp)
        .put(`/api/orders/${orderId}`)
        .send(invalidData);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an existing order', async () => {
      // First create an order to delete using helper
      const orderId = await testHelpers.createTestItem('/api/orders', TestData.order.valid());

      // Test deletion
      await testHelpers.testDelete('/api/orders', orderId);
      
      // Verify order is deleted
      await testHelpers.testGetByIdNotFound('/api/orders', orderId);
    });

    it('should return 404 for non-existent order', async () => {
      await testHelpers.testDeleteNotFound('/api/orders');
    });
  });
});