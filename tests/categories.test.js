const request = require('supertest');
const { app, server } = require('../src/index');
const { db } = require('../src/db/database');

describe('Category API Endpoints', () => {
  // Close server after all tests
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const res = await request(app).get('/api/categories');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by ID', async () => {
      const res = await request(app).get('/api/categories/1');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app).get('/api/categories/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/categories/invalid');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        title: 'Test Category',
        description: 'Test category description'
      };

      const res = await request(app)
        .post('/api/categories')
        .send(newCategory);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', newCategory.title);
      expect(res.body).toHaveProperty('description', newCategory.description);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidCategory = {
        title: 'Test Category'
        // Missing description
      };

      const res = await request(app)
        .post('/api/categories')
        .send(invalidCategory);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const updatedCategory = {
        title: 'Updated Category',
        description: 'Updated category description'
      };

      const res = await request(app)
        .put('/api/categories/1')
        .send(updatedCategory);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title', updatedCategory.title);
      expect(res.body).toHaveProperty('description', updatedCategory.description);
    });

    it('should return 404 for non-existent category', async () => {
      const updatedCategory = {
        title: 'Updated Category',
        description: 'Updated category description'
      };

      const res = await request(app)
        .put('/api/categories/999')
        .send(updatedCategory);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid data', async () => {
      const invalidCategory = {
        title: 'Updated Category'
        // Missing description
      };

      const res = await request(app)
        .put('/api/categories/1')
        .send(invalidCategory);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete an existing category', async () => {
      // Create a category to delete
      const newCategory = {
        title: 'Category to Delete',
        description: 'This category will be deleted'
      };

      const createRes = await request(app)
        .post('/api/categories')
        .send(newCategory);
      
      const categoryId = createRes.body.id;

      const res = await request(app).delete(`/api/categories/${categoryId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify category is deleted
      const getRes = await request(app).get(`/api/categories/${categoryId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app).delete('/api/categories/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for category used by shop items', async () => {
      // Category 1 is used by shop items in seed data
      const res = await request(app).delete('/api/categories/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});