const express = require('express');
const router = express.Router();

const AdminPagesController = require('../controllers/admin_pages.js');

/**
 * GET pages index
 */
router.route('/').get(AdminPagesController.index);

/**
 * POST reorder pages
 */
router.route('/reorder-pages').post(AdminPagesController.reorderPages);

/**
 * Adding pages
 */
router.route('/add-page')
  .get(AdminPagesController.create) // display form
  .post(AdminPagesController.add);   // add new Page

/**
 * Editing pages
 */
router.route('/edit-page/:id')
  .get(AdminPagesController.edit)
  .post(AdminPagesController.update);


/**
 * Deleting pages
 */
router.route('/delete-page/:id').get(AdminPagesController.delete);

module.exports = router;