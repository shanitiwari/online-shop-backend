const request = require('supertest');
const { app, server } = require('../src/index');
const { db } = require('../src/db/database');

describe('Order API Endpoints', () => {
  // Close server after all tests
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // First create an order to ensure there's at least one
      const newOrder = {
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
        .send(newOrder);
      
      const res = await request(app).get('/api/orders');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      
      // Verify order has customer and items
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('customer');
      expect(res.body[0]).toHaveProperty('items');
      expect(Array.isArray(res.body[0].items)).toBeTruthy();
      expect(res.body[0].items[0]).toHaveProperty('shopItem');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return an order by ID', async () => {
      // First create an order to get its ID
      const newOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const createRes = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      const orderId = createRes.body.id;

      const res = await request(app).get(`/api/orders/${orderId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', orderId);
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('id', newOrder.customerId);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', newOrder.items[0].shopItemId);
      expect(res.body.items[0]).toHaveProperty('quantity', newOrder.items[0].quantity);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app).get('/api/orders/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/orders/invalid');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const newOrder = {
        customerId: 2,
        items: [
          {
            shopItemId: 1,
            quantity: 1
          },
          {
            shopItemId: 2,
            quantity: 3
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('id', newOrder.customerId);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(2);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', newOrder.items[0].shopItemId);
      expect(res.body.items[0]).toHaveProperty('quantity', newOrder.items[0].quantity);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidOrder = {
        customerId: 1
        // Missing items
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid customer ID', async () => {
      const invalidOrder = {
        customerId: 999, // Non-existent customer
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid shop item ID', async () => {
      const invalidOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 999, // Non-existent shop item
            quantity: 2
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update an existing order', async () => {
      // First create an order to update
      const newOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const createRes = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      const orderId = createRes.body.id;

      const updatedOrder = {
        customerId: 2, // Change customer
        items: [
          {
            shopItemId: 2, // Change item
            quantity: 5 // Change quantity
          }
        ]
      };

      const res = await request(app)
        .put(`/api/orders/${orderId}`)
        .send(updatedOrder);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', orderId);
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('id', updatedOrder.customerId);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBeTruthy();
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0]).toHaveProperty('shopItem');
      expect(res.body.items[0].shopItem).toHaveProperty('id', updatedOrder.items[0].shopItemId);
      expect(res.body.items[0]).toHaveProperty('quantity', updatedOrder.items[0].quantity);
    });

    it('should return 404 for non-existent order', async () => {
      const updatedOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const res = await request(app)
        .put('/api/orders/999')
        .send(updatedOrder);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid data', async () => {
      // First create an order to update
      const newOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const createRes = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      const orderId = createRes.body.id;

      const invalidOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: -5 // Invalid quantity
          }
        ]
      };

      const res = await request(app)
        .put(`/api/orders/${orderId}`)
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an existing order', async () => {
      // First create an order to delete
      const newOrder = {
        customerId: 1,
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      };

      const createRes = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      const orderId = createRes.body.id;

      const res = await request(app).delete(`/api/orders/${orderId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify order is deleted
      const getRes = await request(app).get(`/api/orders/${orderId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app).delete('/api/orders/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});