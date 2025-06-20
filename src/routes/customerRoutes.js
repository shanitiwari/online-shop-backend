const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// GET /api/customers
router.get('/', customerController.getAll);

// GET /api/customers/:id
router.get('/:id', customerController.getById);

// POST /api/customers
router.post('/', customerController.create);

// PUT /api/customers/:id
router.put('/:id', customerController.update);

// DELETE /api/customers/:id
router.delete('/:id', customerController.delete);

module.exports = router;