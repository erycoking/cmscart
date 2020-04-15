const express = require('express');
const router = express.Router();

const CartController = require('../controllers/cart.js');

/**
 * Get all products
 */
router.route('/').get(CartController.index);

/**
 * Add to cart
 */
router.route('/add/:product').get(CartController.addProductToCart);

/**
 * Get check out page
 */
router.route('/checkout').get(CartController.checkout);

/**
 * Get update cart
 */
router.route('/update/:product').get(CartController.updateCart);

/**
 * Get clear cart
 */
router.route('/clear').get(CartController.clearCart);

/**
 * Get buynow
 */
router.route('/buynow').get(CartController.buynow);

// export
module.exports = router;