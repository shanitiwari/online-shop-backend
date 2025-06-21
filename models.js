const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './shop.db',
  logging: false,
});

const Customer = sequelize.define('Customer', {
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const ShopItemCategory = sequelize.define('ShopItemCategory', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

const ShopItem = sequelize.define('ShopItem', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

const Order = sequelize.define('Order', {});

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

// Relations
ShopItem.belongsToMany(ShopItemCategory, { through: 'ShopItem_ShopItemCategory' });
ShopItemCategory.belongsToMany(ShopItem, { through: 'ShopItem_ShopItemCategory' });

Order.belongsTo(Customer);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(ShopItem);

async function initDbWithTestData() {
  await sequelize.sync({ force: true });

  // Test data
  const [cat1, cat2] = await Promise.all([
    ShopItemCategory.create({ title: 'Electronics', description: 'Electronic items' }),
    ShopItemCategory.create({ title: 'Books', description: 'Books and magazines' }),
  ]);
  const item1 = await ShopItem.create({ title: 'Laptop', description: 'A fast laptop', price: 1200 });
  const item2 = await ShopItem.create({ title: 'Book', description: 'A good book', price: 20 });
  await item1.addShopItemCategory(cat1);
  await item2.addShopItemCategory(cat2);
  const customer = await Customer.create({ name: 'John', surname: 'Doe', email: 'john@example.com' });
  const order = await Order.create({ CustomerId: customer.id });
  await OrderItem.create({ OrderId: order.id, ShopItemId: item1.id, quantity: 1 });
  await OrderItem.create({ OrderId: order.id, ShopItemId: item2.id, quantity: 2 });
}

module.exports = {
  sequelize,
  Customer,
  ShopItemCategory,
  ShopItem,
  Order,
  OrderItem,
  initDbWithTestData,
};
