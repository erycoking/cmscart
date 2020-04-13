const express = require('express');
const router = express.Router();

const AdminCategoryController = require('../controllers/admin_category.js');

/**
 * GET category index
 */
router.route('/').get(AdminCategoryController.index);

/**
 * Adding category
 */
router.route('/add-category')
  .get(AdminCategoryController.create) // display form
  .post(AdminCategoryController.add);   // add new Page

/**
 * Editing category
 */
router.route('/edit-category/:slug')
  .get(AdminCategoryController.edit)
  .post(AdminCategoryController.update);


/**
 * Deleting category
 */
router.route('/delete-category/:id').get(AdminCategoryController.delete);

module.exports = router;