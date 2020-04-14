const express = require('express');
const router = express.Router();

const AdminProductsController = require('../controllers/admin_products.js');

/**
 * GET products index
 */
router.route('/').get(AdminProductsController.index);

/**
 * Adding products
 */
router.route('/add-product')
  .get(AdminProductsController.create) // display form
  .post(AdminProductsController.add);   // add new product

/**
 * Editing products
 */
router.route('/edit-product/:id')
  .get(AdminProductsController.edit)
  .post(AdminProductsController.update);


/**
 * Deleting products
 */
router.route('/delete-product/:id').get(AdminProductsController.delete);

/**
 * Adding images to gallery
 */
router.route('/product-gallery/:id').post(AdminProductsController.addImageToGallery);

/**
 * Deleting images from gallery
 */
router.route('/delete-image/:image').get(AdminProductsController.deleteImageFromGallery);

module.exports = router;