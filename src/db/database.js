/**
 * In-memory database implementation
 */

// Database collections
const db = {
  customers: [],
  categories: [],
  shopItems: [],
  orders: [],
  // Counters for generating IDs
  customerIdCounter: 1,
  categoryIdCounter: 1,
  shopItemIdCounter: 1,
  orderIdCounter: 1,
  orderItemIdCounter: 1
};

// Reset database state (used for testing)
const resetDatabase = () => {
  db.customers = [];
  db.categories = [];
  db.shopItems = [];
  db.orders = [];
  db.customerIdCounter = 1;
  db.categoryIdCounter = 1;
  db.shopItemIdCounter = 1;
  db.orderIdCounter = 1;
  db.orderItemIdCounter = 1;
};

module.exports = {
  db,
  resetDatabase
};