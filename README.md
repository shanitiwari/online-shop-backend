# Online Shop Backend

A minimalistic backend web application for an online shop. This application provides RESTful APIs for managing customers, product categories, shop items, and orders.

## Features

- Full CRUD operations for Customer, ShopItemCategory, ShopItem, and Order entities
- JSON data validation using Joi
- In-memory data persistence with seed data
- Comprehensive error handling
- Automated tests with Jest

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
```
git clone https://github.com/shanitiwari/online-shop-backend.git
cd online-shop-backend
```

2. Install dependencies:
```
npm install
```

## Starting the Server

Run the following command to start the server:
```
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Running Tests

Run the following command to execute the tests:
```
npm test
```

## API Endpoints

### Customers

#### Get all customers
```
GET /api/customers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com"
  },
  {
    "id": 2,
    "name": "Jane",
    "surname": "Smith",
    "email": "jane.smith@example.com"
  }
]
```

#### Get customer by ID
```
GET /api/customers/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com"
}
```

#### Create a new customer
```
POST /api/customers
```

**Request Body:**
```json
{
  "name": "Alice",
  "surname": "Johnson",
  "email": "alice.johnson@example.com"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Alice",
  "surname": "Johnson",
  "email": "alice.johnson@example.com"
}
```

#### Update a customer
```
PUT /api/customers/:id
```

**Request Body:**
```json
{
  "name": "Alice",
  "surname": "Williams",
  "email": "alice.williams@example.com"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Alice",
  "surname": "Williams",
  "email": "alice.williams@example.com"
}
```

#### Delete a customer
```
DELETE /api/customers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Customer with ID 3 deleted successfully"
}
```

### Categories

#### Get all categories
```
GET /api/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  {
    "id": 2,
    "title": "Books",
    "description": "Books and e-books"
  }
]
```

#### Get category by ID
```
GET /api/categories/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

#### Create a new category
```
POST /api/categories
```

**Request Body:**
```json
{
  "title": "Toys",
  "description": "Toys and games"
}
```

**Response:**
```json
{
  "id": 4,
  "title": "Toys",
  "description": "Toys and games"
}
```

#### Update a category
```
PUT /api/categories/:id
```

**Request Body:**
```json
{
  "title": "Toys & Games",
  "description": "Toys, games, and puzzles"
}
```

**Response:**
```json
{
  "id": 4,
  "title": "Toys & Games",
  "description": "Toys, games, and puzzles"
}
```

#### Delete a category
```
DELETE /api/categories/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Category with ID 4 deleted successfully"
}
```

### Shop Items

#### Get all shop items
```
GET /api/items
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Smartphone",
    "description": "Latest smartphone with advanced features",
    "price": 699.99,
    "categoryIds": [1],
    "categories": [
      {
        "id": 1,
        "title": "Electronics",
        "description": "Electronic devices and gadgets"
      }
    ]
  }
]
```

#### Get shop item by ID
```
GET /api/items/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Smartphone",
  "description": "Latest smartphone with advanced features",
  "price": 699.99,
  "categoryIds": [1],
  "categories": [
    {
      "id": 1,
      "title": "Electronics",
      "description": "Electronic devices and gadgets"
    }
  ]
}
```

#### Create a new shop item
```
POST /api/items
```

**Request Body:**
```json
{
  "title": "Headphones",
  "description": "Wireless noise-cancelling headphones",
  "price": 199.99,
  "categoryIds": [1]
}
```

**Response:**
```json
{
  "id": 6,
  "title": "Headphones",
  "description": "Wireless noise-cancelling headphones",
  "price": 199.99,
  "categoryIds": [1],
  "categories": [
    {
      "id": 1,
      "title": "Electronics",
      "description": "Electronic devices and gadgets"
    }
  ]
}
```

#### Update a shop item
```
PUT /api/items/:id
```

**Request Body:**
```json
{
  "title": "Premium Headphones",
  "description": "Wireless noise-cancelling headphones with premium sound",
  "price": 249.99,
  "categoryIds": [1]
}
```

**Response:**
```json
{
  "id": 6,
  "title": "Premium Headphones",
  "description": "Wireless noise-cancelling headphones with premium sound",
  "price": 249.99,
  "categoryIds": [1],
  "categories": [
    {
      "id": 1,
      "title": "Electronics",
      "description": "Electronic devices and gadgets"
    }
  ]
}
```

#### Delete a shop item
```
DELETE /api/items/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Shop item with ID 6 deleted successfully"
}
```

### Orders

#### Get all orders
```
GET /api/orders
```

**Response:**
```json
[
  {
    "id": 1,
    "customer": {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john.doe@example.com"
    },
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "shopItem": {
          "id": 1,
          "title": "Smartphone",
          "description": "Latest smartphone with advanced features",
          "price": 699.99
        }
      }
    ]
  }
]
```

#### Get order by ID
```
GET /api/orders/:id
```

**Response:**
```json
{
  "id": 1,
  "customer": {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com"
  },
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "shopItem": {
        "id": 1,
        "title": "Smartphone",
        "description": "Latest smartphone with advanced features",
        "price": 699.99
      }
    }
  ]
}
```

#### Create a new order
```
POST /api/orders
```

**Request Body:**
```json
{
  "customerId": 1,
  "items": [
    {
      "shopItemId": 1,
      "quantity": 2
    },
    {
      "shopItemId": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 2,
  "customer": {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com"
  },
  "items": [
    {
      "id": 3,
      "quantity": 2,
      "shopItem": {
        "id": 1,
        "title": "Smartphone",
        "description": "Latest smartphone with advanced features",
        "price": 699.99
      }
    },
    {
      "id": 4,
      "quantity": 1,
      "shopItem": {
        "id": 2,
        "title": "Laptop",
        "description": "Powerful laptop for work and gaming",
        "price": 1299.99
      }
    }
  ]
}
```

#### Update an order
```
PUT /api/orders/:id
```

**Request Body:**
```json
{
  "customerId": 2,
  "items": [
    {
      "shopItemId": 3,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 2,
  "customer": {
    "id": 2,
    "name": "Jane",
    "surname": "Smith",
    "email": "jane.smith@example.com"
  },
  "items": [
    {
      "id": 5,
      "quantity": 1,
      "shopItem": {
        "id": 3,
        "title": "Programming Book",
        "description": "Learn programming with this comprehensive guide",
        "price": 49.99
      }
    }
  ]
}
```

#### Delete an order
```
DELETE /api/orders/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Order with ID 2 deleted successfully"
}
```

## Error Handling

All endpoints include proper error handling with appropriate HTTP status codes:

- `400 Bad Request` - For validation errors or invalid input
- `404 Not Found` - When a requested resource does not exist
- `500 Internal Server Error` - For unexpected server errors

Error responses follow this structure:
```json
{
  "error": true,
  "message": "Error message description"
}
```

## Project Structure

```
online-shop-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── db/              # Database implementation
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Data models and validation
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.js         # Application entry point
├── tests/               # Automated tests
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore file
├── jest.config.js       # Jest configuration
├── package.json         # Node.js dependencies
└── README.md            # Project documentation
```

## Linting

Run the following command to lint the code:
```
npm run lint
```

## License

This project is licensed under the MIT License.