const { db, resetDatabase } = require('./database');

/**
 * Seeds the database with initial data
 */
const seedDatabase = () => {
  console.log('Seeding database with initial data...');
  
  // Reset database before seeding
  resetDatabase();
  
  // Seed customers
  const customers = [
    { name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
    { name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' },
    { name: 'Alice', surname: 'Johnson', email: 'alice.johnson@example.com' }
  ];
  
  customers.forEach(customer => {
    db.customers.push({
      id: db.customerIdCounter++,
      ...customer
    });
  });
  
  // Seed categories
  const categories = [
    { title: 'Electronics', description: 'Electronic devices and gadgets' },
    { title: 'Books', description: 'Books and e-books' },
    { title: 'Clothing', description: 'Apparel and fashion accessories' }
  ];
  
  categories.forEach(category => {
    db.categories.push({
      id: db.categoryIdCounter++,
      ...category
    });
  });
  
  // Seed shop items
  const shopItems = [
    { 
      title: 'Smartphone', 
      description: 'Latest smartphone with advanced features', 
      price: 699.99,
      categoryIds: [1] // Electronics
    },
    { 
      title: 'Laptop', 
      description: 'Powerful laptop for work and gaming', 
      price: 1299.99,
      categoryIds: [1] // Electronics
    },
    { 
      title: 'Programming Book', 
      description: 'Learn programming with this comprehensive guide', 
      price: 49.99,
      categoryIds: [2] // Books
    },
    { 
      title: 'T-shirt', 
      description: 'Comfortable cotton t-shirt', 
      price: 19.99,
      categoryIds: [3] // Clothing
    },
    { 
      title: 'Smart Watch', 
      description: 'Track your fitness and receive notifications', 
      price: 249.99,
      categoryIds: [1, 3] // Electronics & Clothing
    }
  ];
  
  shopItems.forEach(item => {
    const shopItem = {
      id: db.shopItemIdCounter++,
      title: item.title,
      description: item.description,
      price: item.price,
      categoryIds: item.categoryIds
    };
    db.shopItems.push(shopItem);
  });
  
  console.log('Database seeded successfully');
  console.log(`Seeded: ${db.customers.length} customers, ${db.categories.length} categories, ${db.shopItems.length} shop items`);
};

module.exports = {
  seedDatabase
};