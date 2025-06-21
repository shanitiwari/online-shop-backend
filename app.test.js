const request = require('supertest');
const { app, initDbWithTestData } = require('./app');

beforeAll(async () => {
  await initDbWithTestData();
});

describe('Customer API', () => {
  let createdId;
  it('GET /customers returns list', async () => {
    const res = await request(app).get('/customers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('POST /customers creates', async () => {
    const res = await request(app).post('/customers').send({ name: 'Jane', surname: 'Smith', email: 'jane@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });
  it('GET /customers/:id returns one', async () => {
    const res = await request(app).get(`/customers/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Jane');
  });
  it('PUT /customers/:id updates', async () => {
    const res = await request(app).put(`/customers/${createdId}`).send({ name: 'Janet' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Janet');
  });
  it('DELETE /customers/:id deletes', async () => {
    const res = await request(app).delete(`/customers/${createdId}`);
    expect(res.status).toBe(204);
  });
});

describe('ShopItemCategory API', () => {
  let createdId;
  it('GET /categories returns list', async () => {
    const res = await request(app).get('/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('POST /categories creates', async () => {
    const res = await request(app).post('/categories').send({ title: 'Toys', description: 'Toys for kids' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });
  it('GET /categories/:id returns one', async () => {
    const res = await request(app).get(`/categories/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Toys');
  });
  it('PUT /categories/:id updates', async () => {
    const res = await request(app).put(`/categories/${createdId}`).send({ title: 'Games' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Games');
  });
  it('DELETE /categories/:id deletes', async () => {
    const res = await request(app).delete(`/categories/${createdId}`);
    expect(res.status).toBe(204);
  });
});

describe('ShopItem API', () => {
  let catId, itemId;
  beforeAll(async () => {
    const cat = await request(app).post('/categories').send({ title: 'Gadgets', description: 'Gadgets' });
    catId = cat.body.id;
  });
  it('POST /items creates', async () => {
    const res = await request(app).post('/items').send({ title: 'Phone', description: 'Smartphone', price: 500, categoryIds: [catId] });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    itemId = res.body.id;
  });
  it('GET /items returns list', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('GET /items/:id returns one', async () => {
    const res = await request(app).get(`/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Phone');
  });
  it('PUT /items/:id updates', async () => {
    const res = await request(app).put(`/items/${itemId}`).send({ title: 'Tablet', price: 700, categoryIds: [catId] });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Tablet');
  });
  it('DELETE /items/:id deletes', async () => {
    const res = await request(app).delete(`/items/${itemId}`);
    expect(res.status).toBe(204);
  });
});

describe('Order API', () => {
  let customerId, itemId, orderId;
  beforeAll(async () => {
    const cust = await request(app).post('/customers').send({ name: 'Order', surname: 'Test', email: 'order@example.com' });
    customerId = cust.body.id;
    const cat = await request(app).post('/categories').send({ title: 'OrderCat', description: 'OrderCat' });
    const item = await request(app).post('/items').send({ title: 'OrderItem', description: 'OrderItem', price: 10, categoryIds: [cat.body.id] });
    itemId = item.body.id;
  });
  it('POST /orders creates', async () => {
    const res = await request(app).post('/orders').send({ customerId, items: [{ shopItemId: itemId, quantity: 3 }] });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    orderId = res.body.id;
  });
  it('GET /orders returns list', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('GET /orders/:id returns one', async () => {
    const res = await request(app).get(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
  });
  it('PUT /orders/:id updates', async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({ items: [{ shopItemId: itemId, quantity: 5 }] });
    expect(res.status).toBe(200);
    expect(res.body.OrderItems[0].quantity).toBe(5);
  });
  it('DELETE /orders/:id deletes', async () => {
    const res = await request(app).delete(`/orders/${orderId}`);
    expect(res.status).toBe(204);
  });
});
