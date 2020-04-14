const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.js');

/**
 * Get home page
 */
router.route('/').get(UserController.index);

/**
 * Get Other pages
 */
router.route('/:slug').get(UserController.getPage);

// export
module.exports = router;