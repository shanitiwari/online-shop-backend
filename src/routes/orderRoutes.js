const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// GET /api/orders
router.get('/', orderController.getAll);

// GET /api/orders/:id
router.get('/:id', orderController.getById);

// POST /api/orders
router.post('/', orderController.create);

// PUT /api/orders/:id
router.put('/:id', orderController.update);

// DELETE /api/orders/:id
router.delete('/:id', orderController.delete);

module.exports = router;