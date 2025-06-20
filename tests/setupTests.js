const { resetDatabase, seedDatabase } = require('../src/db/database');

// Reset database before each test
beforeEach(() => {
  resetDatabase();
  seedDatabase();
});