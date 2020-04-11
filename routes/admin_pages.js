const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.js');

router.route('/home')
  .get(AdminController.index);

module.exports = router;