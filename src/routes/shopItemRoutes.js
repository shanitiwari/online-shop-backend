const express = require('express');
const shopItemController = require('../controllers/shopItemController');

const router = express.Router();

// GET /api/items
router.get('/', shopItemController.getAll);

// GET /api/items/:id
router.get('/:id', shopItemController.getById);

// POST /api/items
router.post('/', shopItemController.create);

// PUT /api/items/:id
router.put('/:id', shopItemController.update);

// DELETE /api/items/:id
router.delete('/:id', shopItemController.delete);

module.exports = router;