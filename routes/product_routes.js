const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/products.js');

/**
 * Get all products
 */
router.route('/').get(ProductController.index);

/**
 * Get products by category
 */
router.route('/:c_slug').get(ProductController.getProductsByCategory);

/**
 * Get products details
 */
router.route('/:category/:product').get(ProductController.getProductDetails);

// export
module.exports = router;