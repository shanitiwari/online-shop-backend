const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories
router.get('/', categoryController.getAll);

// GET /api/categories/:id
router.get('/:id', categoryController.getById);

// POST /api/categories
router.post('/', categoryController.create);

// PUT /api/categories/:id
router.put('/:id', categoryController.update);

// DELETE /api/categories/:id
router.delete('/:id', categoryController.delete);

module.exports = router;