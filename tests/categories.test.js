const { TestData } = require('./utils/testHelpers');

describe('Category API Endpoints', () => {

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      await testHelpers.testGetAll('/api/categories', ['title', 'description']);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by ID', async () => {
      await testHelpers.testGetById('/api/categories', 1, ['title', 'description']);
    });

    it('should return 404 for non-existent category', async () => {
      await testHelpers.testGetByIdNotFound('/api/categories');
    });

    it('should return 400 for invalid ID format', async () => {
      await testHelpers.testGetByIdInvalidFormat('/api/categories');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      await testHelpers.testCreate('/api/categories', TestData.category.valid());
    });

    it('should return 400 for missing required fields', async () => {
      await testHelpers.testCreateValidationError('/api/categories', TestData.category.invalid.missingFields());
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      await testHelpers.testUpdate('/api/categories', 1, TestData.category.update());
    });

    it('should return 404 for non-existent category', async () => {
      await testHelpers.testUpdateNotFound('/api/categories', 999, TestData.category.update());
    });

    it('should return 400 for invalid data', async () => {
      await testHelpers.testUpdateValidationError('/api/categories', 1, TestData.category.invalid.missingFields());
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete an existing category', async () => {
      // Create a category to delete using helper
      const categoryId = await testHelpers.createTestItem('/api/categories', TestData.category.valid());
      
      // Test deletion
      await testHelpers.testDelete('/api/categories', categoryId);
      
      // Verify category is deleted
      await testHelpers.testGetByIdNotFound('/api/categories', categoryId);
    });

    it('should return 404 for non-existent category', async () => {
      await testHelpers.testDeleteNotFound('/api/categories');
    });

    it('should return 400 for category used by shop items', async () => {
      // Category 1 is used by shop items in seed data - should fail due to business rule
      const request = require('supertest');
      const res = await request(testApp).delete('/api/categories/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});