# Online Shop Backend

A minimalistic backend web app for an online shop, built with Node.js, Express, Sequelize, and SQLite.

## Features
- CRUD APIs for Customer, ShopItemCategory, ShopItem, and Order
- SQLite database with Sequelize ORM
- Initial test data on startup
- Endpoint autotests using Jest and Supertest

## Requirements
- Node.js v14.x or later
- npm

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the application:
   ```bash
   npm start
   ```
   The server will start on port 3000 by default.

3. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### Customers
- `GET    /customers`         - List all customers
- `GET    /customers/:id`     - Get customer by ID
- `POST   /customers`         - Create a customer
- `PUT    /customers/:id`     - Update a customer
- `DELETE /customers/:id`     - Delete a customer

### ShopItemCategories
- `GET    /categories`        - List all categories
- `GET    /categories/:id`    - Get category by ID
- `POST   /categories`        - Create a category
- `PUT    /categories/:id`    - Update a category
- `DELETE /categories/:id`    - Delete a category

### ShopItems
- `GET    /items`             - List all items
- `GET    /items/:id`         - Get item by ID
- `POST   /items`             - Create an item (with categoryIds)
- `PUT    /items/:id`         - Update an item (with categoryIds)
- `DELETE /items/:id`         - Delete an item

### Orders
- `GET    /orders`            - List all orders
- `GET    /orders/:id`        - Get order by ID
- `POST   /orders`            - Create an order (with customerId and items)
- `PUT    /orders/:id`        - Update an order (customerId/items)
- `DELETE /orders/:id`        - Delete an order

## Notes
- The database is reset and seeded with test data on every server start.
- All endpoints are covered by autotests in `app.test.js`.
