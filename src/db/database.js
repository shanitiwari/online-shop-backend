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

// Seed database with initial data (used for testing)
const seedDatabase = () => {
  resetDatabase();
  // Add customers
  db.customers.push(
    { id: db.customerIdCounter++, name: "Alice", surname: "Johnson", email: "alice@example.com" },
    { id: db.customerIdCounter++, name: "Bob", surname: "Smith", email: "bob@example.com" },
    { id: db.customerIdCounter++, name: "Charlie", surname: "Brown", email: "charlie@example.com" }
  );
  // Add categories
  db.categories.push(
    { id: db.categoryIdCounter++, title: "Electronics", description: 'Electronic devices and gadgets' },
    { id: db.categoryIdCounter++, title: "Books", description: 'Books and e-books'  },
    { id: db.categoryIdCounter++, title: "Clothing", description: 'Apparel and fashion accessories'  }
  );
  // Add shop items (match model: title, description, price, categoryIds)
  db.shopItems.push(
    {
      id: db.shopItemIdCounter++,
      title: "Laptop",
      description: "A powerful laptop",
      price: 1000,
      categoryIds: [1]
    },
    {
      id: db.shopItemIdCounter++,
      title: "Smartphone",
      description: "A modern smartphone",
      price: 500,
      categoryIds: [1]
    },
    {
      id: db.shopItemIdCounter++,
      title: "Novel",
      description: "A best-selling novel",
      price: 20,
      categoryIds: [2]
    },
    {
      id: db.shopItemIdCounter++,
      title: "T-Shirt",
      description: "A comfortable t-shirt",
      price: 15,
      categoryIds: [3]
    },
    {
      id: db.shopItemIdCounter++,
      title: "Jeans",
      description: "Stylish jeans",
      price: 40,
      categoryIds: [3]
    }
  );
};

module.exports = {
  db,
  resetDatabase,
  seedDatabase
};