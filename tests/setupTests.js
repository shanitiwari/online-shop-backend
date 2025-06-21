const { resetDatabase, seedDatabase } = require('../src/db/database');
const { app, server } = require('../src/index');
const { TestHelpers } = require('./utils/testHelpers');

// Create a global test helpers instance
global.testHelpers = new TestHelpers(app);
global.testApp = app;
global.testServer = server;

// Reset database before each test
beforeEach(() => {
  resetDatabase();
  seedDatabase();
});

// Global cleanup for all test files
afterAll((done) => {
  if (server && server.listening) {
    server.close(done);
  } else {
    done();
  }
});