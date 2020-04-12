const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.js');

router.route('/').get(AdminController.index);
router.route('/add-page')
  .get(AdminController.addPageForm)
  .post(AdminController.addPage);

module.exports = router;