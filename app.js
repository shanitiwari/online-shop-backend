const express = require('express');
const bodyParser = require('body-parser');
const {
  sequelize,
  Customer,
  ShopItemCategory,
  ShopItem,
  Order,
  OrderItem,
  initDbWithTestData,
} = require('./models');

const app = express();
app.use(bodyParser.json());

// --- Customer CRUD ---
app.get('/customers', async (req, res) => {
  res.json(await Customer.findAll());
});
app.get('/customers/:id', async (req, res) => {
  const c = await Customer.findByPk(req.params.id);
  if (!c) return res.status(404).send();
  res.json(c);
});
app.post('/customers', async (req, res) => {
  const c = await Customer.create(req.body);
  res.status(201).json(c);
});
app.put('/customers/:id', async (req, res) => {
  const c = await Customer.findByPk(req.params.id);
  if (!c) return res.status(404).send();
  await c.update(req.body);
  res.json(c);
});
app.delete('/customers/:id', async (req, res) => {
  const c = await Customer.findByPk(req.params.id);
  if (!c) return res.status(404).send();
  await c.destroy();
  res.status(204).send();
});

// --- ShopItemCategory CRUD ---
app.get('/categories', async (req, res) => {
  res.json(await ShopItemCategory.findAll());
});
app.get('/categories/:id', async (req, res) => {
  const cat = await ShopItemCategory.findByPk(req.params.id);
  if (!cat) return res.status(404).send();
  res.json(cat);
});
app.post('/categories', async (req, res) => {
  const cat = await ShopItemCategory.create(req.body);
  res.status(201).json(cat);
});
app.put('/categories/:id', async (req, res) => {
  const cat = await ShopItemCategory.findByPk(req.params.id);
  if (!cat) return res.status(404).send();
  await cat.update(req.body);
  res.json(cat);
});
app.delete('/categories/:id', async (req, res) => {
  const cat = await ShopItemCategory.findByPk(req.params.id);
  if (!cat) return res.status(404).send();
  await cat.destroy();
  res.status(204).send();
});

// --- ShopItem CRUD ---
app.get('/items', async (req, res) => {
  res.json(await ShopItem.findAll({ include: ShopItemCategory }));
});
app.get('/items/:id', async (req, res) => {
  const item = await ShopItem.findByPk(req.params.id, { include: ShopItemCategory });
  if (!item) return res.status(404).send();
  res.json(item);
});
app.post('/items', async (req, res) => {
  const { title, description, price, categoryIds } = req.body;
  const item = await ShopItem.create({ title, description, price });
  if (categoryIds) {
    const cats = await ShopItemCategory.findAll({ where: { id: categoryIds } });
    await item.setShopItemCategories(cats);
  }
  res.status(201).json(await ShopItem.findByPk(item.id, { include: ShopItemCategory }));
});
app.put('/items/:id', async (req, res) => {
  const item = await ShopItem.findByPk(req.params.id);
  if (!item) return res.status(404).send();
  const { title, description, price, categoryIds } = req.body;
  await item.update({ title, description, price });
  if (categoryIds) {
    const cats = await ShopItemCategory.findAll({ where: { id: categoryIds } });
    await item.setShopItemCategories(cats);
  }
  res.json(await ShopItem.findByPk(item.id, { include: ShopItemCategory }));
});
app.delete('/items/:id', async (req, res) => {
  const item = await ShopItem.findByPk(req.params.id);
  if (!item) return res.status(404).send();
  await item.destroy();
  res.status(204).send();
});

// --- Order CRUD ---
app.get('/orders', async (req, res) => {
  res.json(await Order.findAll({ include: [Customer, { model: OrderItem, include: [ShopItem] }] }));
});
app.get('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [Customer, { model: OrderItem, include: [ShopItem] }] });
  if (!order) return res.status(404).send();
  res.json(order);
});
app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body;
  const order = await Order.create({ CustomerId: customerId });
  for (const it of items) {
    await OrderItem.create({ OrderId: order.id, ShopItemId: it.shopItemId, quantity: it.quantity });
  }
  res.status(201).json(await Order.findByPk(order.id, { include: [Customer, { model: OrderItem, include: [ShopItem] }] }));
});
app.put('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).send();
  const { customerId, items } = req.body;
  if (customerId) await order.update({ CustomerId: customerId });
  if (items) {
    await OrderItem.destroy({ where: { OrderId: order.id } });
    for (const it of items) {
      await OrderItem.create({ OrderId: order.id, ShopItemId: it.shopItemId, quantity: it.quantity });
    }
  }
  res.json(await Order.findByPk(order.id, { include: [Customer, { model: OrderItem, include: [ShopItem] }] }));
});
app.delete('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).send();
  await OrderItem.destroy({ where: { OrderId: order.id } });
  await order.destroy();
  res.status(204).send();
});

// --- DB Init and Server Start ---
async function startServer() {
  await initDbWithTestData();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, initDbWithTestData };
