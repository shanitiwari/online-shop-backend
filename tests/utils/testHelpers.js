const request = require('supertest');

/**
 * Common test utilities and helpers for all test files
 */
class TestHelpers {
  constructor(app) {
    this.app = app;
  }

  /**
   * Common server cleanup function for afterAll hooks
   */
  static closeServer(server) {
    return (done) => {
      server.close(done);
    };
  }

  /**
   * Generic test for getting all items from an endpoint
   */
  async testGetAll(endpoint, expectedProperties = []) {
    const res = await request(this.app).get(endpoint);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);

    if (expectedProperties.length > 0) {
      expectedProperties.forEach(prop => {
        expect(res.body[0]).toHaveProperty(prop);
      });
    }

    return res;
  }

  /**
   * Generic test for getting a single item by ID
   */
  async testGetById(endpoint, id, expectedProperties = []) {
    const res = await request(this.app).get(`${endpoint}/${id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', id);

    expectedProperties.forEach(prop => {
      expect(res.body).toHaveProperty(prop);
    });

    return res;
  }

  /**
   * Generic test for 404 errors when getting non-existent items
   */
  async testGetByIdNotFound(endpoint, id = 999) {
    const res = await request(this.app).get(`${endpoint}/${id}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for 400 errors when using invalid ID format
   */
  async testGetByIdInvalidFormat(endpoint, invalidId = 'invalid') {
    const res = await request(this.app).get(`${endpoint}/${invalidId}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for creating new items
   */
  async testCreate(endpoint, data, expectedStatusCode = 201) {
    const res = await request(this.app)
      .post(endpoint)
      .send(data);

    expect(res.statusCode).toEqual(expectedStatusCode);
    expect(res.body).toHaveProperty('id');
    return res;
  }

  /**
   * Generic test for validation errors during creation
   */
  async testCreateValidationError(endpoint, invalidData) {
    const res = await request(this.app)
      .post(endpoint)
      .send(invalidData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for validation errors during updates
   */
  async testUpdateValidationError(endpoint, id, invalidData) {
    const res = await request(this.app)
      .put(`${endpoint}/${id}`)
      .send(invalidData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for updating items
   */
  async testUpdate(endpoint, id, updateData, expectedStatusCode = 200) {
    const res = await request(this.app)
      .put(`${endpoint}/${id}`)
      .send(updateData);

    expect(res.statusCode).toEqual(expectedStatusCode);
    expect(res.body).toHaveProperty('id', id);
    return res;
  }

  /**
   * Generic test for updating non-existent items
   */
  async testUpdateNotFound(endpoint, id = 999, updateData = {}) {
    const res = await request(this.app)
      .put(`${endpoint}/${id}`)
      .send(updateData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for deleting items
   */
  async testDelete(endpoint, id, expectedStatusCode = 200) {
    const res = await request(this.app).delete(`${endpoint}/${id}`);

    expect(res.statusCode).toEqual(expectedStatusCode);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Generic test for deleting non-existent items
   */
  async testDeleteNotFound(endpoint, id = 999) {
    const res = await request(this.app).delete(`${endpoint}/${id}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message');

    return res;
  }

  /**
   * Helper to create a test item and return its ID
   */
  async createTestItem(endpoint, data) {
    const res = await request(this.app)
      .post(endpoint)
      .send(data);

    expect(res.statusCode).toEqual(201);
    return res.body.id;
  }
}

/**
 * Common test data generators
 */
const TestData = {
  customer: {
    valid: () => ({
      name: 'Test',
      surname: 'User',
      email: 'test.user@example.com'
    }),

    invalid: {
      missingFields: () => ({
        name: 'Test'
        // Missing surname and email
      }),

      invalidEmail: () => ({
        name: 'Test',
        surname: 'User',
        email: 'invalid-email'
      })
    },

    update: () => ({
      name: 'Updated',
      surname: 'User',
      email: 'updated.user@example.com'
    })
  },

  category: {
    valid: () => ({
      title: 'Test Category',
      description: 'Test category description'
    }),

    invalid: {
      missingFields: () => ({
        title: 'Test Category'
        // Missing description
      })
    },

    update: () => ({
      title: 'Updated Category',
      description: 'Updated category description'
    })
  },

  shopItem: {
    valid: () => ({
      title: 'Test Item',
      description: 'Test item description',
      price: 99.99,
      categoryIds: [1, 2]
    }),

    invalid: {
      missingFields: () => ({
        title: 'Test Item',
        description: 'Test item description'
        // Missing price and categoryIds
      }),

      invalidCategory: () => ({
        title: 'Test Item',
        description: 'Test item description',
        price: 99.99,
        categoryIds: [999] // Non-existent category
      })
    },

    update: () => ({
      title: 'Updated Item',
      description: 'Updated item description',
      price: 149.99,
      categoryIds: [1]
    })
  },

  order: {
    valid: () => ({
      customerId: 1,
      items: [
        {
          shopItemId: 1,
          quantity: 2
        }
      ]
    }),

    withMultipleItems: () => ({
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
    }),

    invalid: {
      missingCustomer: () => ({
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      }),

      invalidCustomer: () => ({
        customerId: 999, // Non-existent customer
        items: [
          {
            shopItemId: 1,
            quantity: 2
          }
        ]
      }),

      invalidShopItem: () => ({
        customerId: 1,
        items: [
          {
            shopItemId: 999, // Non-existent shop item
            quantity: 2
          }
        ]
      })
    },

    update: () => ({
      customerId: 2,
      items: [
        {
          shopItemId: 2,
          quantity: 1
        }
      ]
    })
  }
};

module.exports = {
  TestHelpers,
  TestData
};