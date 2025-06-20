const request = require('supertest');
const { app, server } = require('../src/index');
const { db } = require('../src/db/database');

describe('Shop Item API Endpoints', () => {
  // Close server after all tests
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/items', () => {
    it('should return all shop items', async () => {
      const res = await request(app).get('/api/items');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      
      // Verify the first item has categories
      expect(res.body[0]).toHaveProperty('categories');
      expect(Array.isArray(res.body[0].categories)).toBeTruthy();
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a shop item by ID', async () => {
      const res = await request(app).get('/api/items/1');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('price');
      expect(res.body).toHaveProperty('categoryIds');
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
    });

    it('should return 404 for non-existent shop item', async () => {
      const res = await request(app).get('/api/items/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/items/invalid');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new shop item', async () => {
      const newShopItem = {
        title: 'Test Item',
        description: 'Test item description',
        price: 99.99,
        categoryIds: [1, 2]
      };

      const res = await request(app)
        .post('/api/items')
        .send(newShopItem);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', newShopItem.title);
      expect(res.body).toHaveProperty('description', newShopItem.description);
      expect(res.body).toHaveProperty('price', newShopItem.price);
      expect(res.body).toHaveProperty('categoryIds');
      expect(res.body.categoryIds).toEqual(expect.arrayContaining(newShopItem.categoryIds));
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
      expect(res.body.categories.length).toBe(2);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidShopItem = {
        title: 'Test Item',
        description: 'Test item description'
        // Missing price and categoryIds
      };

      const res = await request(app)
        .post('/api/items')
        .send(invalidShopItem);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid category ID', async () => {
      const invalidShopItem = {
        title: 'Test Item',
        description: 'Test item description',
        price: 99.99,
        categoryIds: [999] // Non-existent category
      };

      const res = await request(app)
        .post('/api/items')
        .send(invalidShopItem);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing shop item', async () => {
      const updatedShopItem = {
        title: 'Updated Item',
        description: 'Updated item description',
        price: 149.99,
        categoryIds: [2, 3]
      };

      const res = await request(app)
        .put('/api/items/1')
        .send(updatedShopItem);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title', updatedShopItem.title);
      expect(res.body).toHaveProperty('description', updatedShopItem.description);
      expect(res.body).toHaveProperty('price', updatedShopItem.price);
      expect(res.body).toHaveProperty('categoryIds');
      expect(res.body.categoryIds).toEqual(expect.arrayContaining(updatedShopItem.categoryIds));
      expect(res.body).toHaveProperty('categories');
      expect(Array.isArray(res.body.categories)).toBeTruthy();
      expect(res.body.categories.length).toBe(2);
    });

    it('should return 404 for non-existent shop item', async () => {
      const updatedShopItem = {
        title: 'Updated Item',
        description: 'Updated item description',
        price: 149.99,
        categoryIds: [1, 2]
      };

      const res = await request(app)
        .put('/api/items/999')
        .send(updatedShopItem);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid data', async () => {
      const invalidShopItem = {
        title: 'Updated Item',
        description: 'Updated item description',
        price: -10, // Invalid price
        categoryIds: [1]
      };

      const res = await request(app)
        .put('/api/items/1')
        .send(invalidShopItem);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing shop item', async () => {
      // Create a shop item to delete
      const newShopItem = {
        title: 'Item to Delete',
        description: 'This item will be deleted',
        price: 29.99,
        categoryIds: [1]
      };

      const createRes = await request(app)
        .post('/api/items')
        .send(newShopItem);
      
      const shopItemId = createRes.body.id;

      const res = await request(app).delete(`/api/items/${shopItemId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify shop item is deleted
      const getRes = await request(app).get(`/api/items/${shopItemId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for non-existent shop item', async () => {
      const res = await request(app).delete('/api/items/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for shop item used in orders', async () => {
      // Create an order with the first shop item
      const order = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      await request(app)
        .post('/api/orders')
        .send(order);
      
      // Try to delete the shop item
      const res = await request(app).delete('/api/items/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});