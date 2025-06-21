const { TestData } = require('./utils/testHelpers');

describe('Shop Item API Endpoints', () => {

  describe('GET /api/items', () => {
    it('should return all shop items', async () => {
      const res = await testHelpers.testGetAll('/api/items', ['title', 'description', 'price', 'categoryIds']);
      
      // Verify the first item has categories
      expect(res.body[0]).toHaveProperty('categories');
      expect(Array.isArray(res.body[0].categories)).toBeTruthy();
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a shop item by ID', async () => {
      const res = await testHelpers.testGetById('/api/items', 1, ['title', 'description', 'price', 'categoryIds']);
      
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
    });

    it('should return 404 for non-existent shop item', async () => {
      await testHelpers.testGetByIdNotFound('/api/items');
    });

    it('should return 400 for invalid ID format', async () => {
      await testHelpers.testGetByIdInvalidFormat('/api/items');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new shop item', async () => {
      const res = await testHelpers.testCreate('/api/items', TestData.shopItem.valid());
      
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
      expect(res.body.categories.length).toBe(2);
    });

    it('should return 400 for missing required fields', async () => {
      await testHelpers.testCreateValidationError('/api/items', TestData.shopItem.invalid.missingFields());
    });

    it('should return 400 for invalid category ID', async () => {
      await testHelpers.testCreateValidationError('/api/items', TestData.shopItem.invalid.invalidCategory());
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing shop item', async () => {
      const updateData = { ...TestData.shopItem.update(), categoryIds: [2, 3] };
      const res = await testHelpers.testUpdate('/api/items', 1, updateData);
      
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
      expect(res.body.categories.length).toBe(2);
    });

    it('should return 404 for non-existent shop item', async () => {
      await testHelpers.testUpdateNotFound('/api/items', 999, TestData.shopItem.update());
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = { ...TestData.shopItem.valid(), price: -10 }; // Invalid price
      await testHelpers.testUpdateValidationError('/api/items', 1, invalidData);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing shop item', async () => {
      // Create a shop item to delete using helper
      const shopItemId = await testHelpers.createTestItem('/api/items', TestData.shopItem.valid());
      
      // Test deletion
      await testHelpers.testDelete('/api/items', shopItemId);
      
      // Verify shop item is deleted
      await testHelpers.testGetByIdNotFound('/api/items', shopItemId);
    });

    it('should return 404 for non-existent shop item', async () => {
      await testHelpers.testDeleteNotFound('/api/items');
    });

    it('should return 400 for shop item used in orders', async () => {
      // Create an order with the first shop item using test data
      const order = TestData.order.valid();
      await testHelpers.createTestItem('/api/orders', order);
      
      // Try to delete the shop item - should fail due to business rule
      const request = require('supertest');
      const res = await request(testApp).delete('/api/items/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});