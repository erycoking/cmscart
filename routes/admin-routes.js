const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.js');

/**
 * GET pages index
 */
router.route('/').get(AdminController.index);

/**
 * POST reorder pages
 */
router.route('/reorder-pages').post(AdminController.reorderPages);

/**
 * Adding pages
 */
router.route('/add-page')
  .get(AdminController.read) // display form
  .post(AdminController.create);   // add new Page

/**
 * Editing pages
 */
router.route('/edit-page/:slug')
  .get(AdminController.edit)
  .post(AdminController.update);


/**
 * Deleting pages
 */
router.route('/delete-page/:id').get(AdminController.delete);

module.exports = router;