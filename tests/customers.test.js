const request = require('supertest');
const { app, server } = require('../src/index');
const { db } = require('../src/db/database');

describe('Customer API Endpoints', () => {
  // Close server after all tests
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      const res = await request(app).get('/api/customers');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by ID', async () => {
      const res = await request(app).get('/api/customers/1');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('surname');
      expect(res.body).toHaveProperty('email');
    });

    it('should return 404 for non-existent customer', async () => {
      const res = await request(app).get('/api/customers/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/customers/invalid');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const newCustomer = {
        name: 'Test',
        surname: 'User',
        email: 'test.user@example.com'
      };

      const res = await request(app)
        .post('/api/customers')
        .send(newCustomer);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', newCustomer.name);
      expect(res.body).toHaveProperty('surname', newCustomer.surname);
      expect(res.body).toHaveProperty('email', newCustomer.email);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidCustomer = {
        name: 'Test'
        // Missing surname and email
      };

      const res = await request(app)
        .post('/api/customers')
        .send(invalidCustomer);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidCustomer = {
        name: 'Test',
        surname: 'User',
        email: 'invalid-email'
      };

      const res = await request(app)
        .post('/api/customers')
        .send(invalidCustomer);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update an existing customer', async () => {
      const updatedCustomer = {
        name: 'Updated',
        surname: 'User',
        email: 'updated.user@example.com'
      };

      const res = await request(app)
        .put('/api/customers/1')
        .send(updatedCustomer);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name', updatedCustomer.name);
      expect(res.body).toHaveProperty('surname', updatedCustomer.surname);
      expect(res.body).toHaveProperty('email', updatedCustomer.email);
    });

    it('should return 404 for non-existent customer', async () => {
      const updatedCustomer = {
        name: 'Updated',
        surname: 'User',
        email: 'updated.user@example.com'
      };

      const res = await request(app)
        .put('/api/customers/999')
        .send(updatedCustomer);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid data', async () => {
      const invalidCustomer = {
        name: 'Updated'
        // Missing surname and email
      };

      const res = await request(app)
        .put('/api/customers/1')
        .send(invalidCustomer);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should delete an existing customer', async () => {
      // Create a customer to delete
      const newCustomer = {
        name: 'Delete',
        surname: 'Me',
        email: 'delete.me@example.com'
      };

      const createRes = await request(app)
        .post('/api/customers')
        .send(newCustomer);
      
      const customerId = createRes.body.id;

      const res = await request(app).delete(`/api/customers/${customerId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify customer is deleted
      const getRes = await request(app).get(`/api/customers/${customerId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for non-existent customer', async () => {
      const res = await request(app).delete('/api/customers/999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for customer with orders', async () => {
      // Create an order for the first customer
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
      
      // Try to delete the customer
      const res = await request(app).delete('/api/customers/1');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});