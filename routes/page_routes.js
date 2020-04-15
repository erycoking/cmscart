const express = require('express');
const router = express.Router();

const PageController = require('../controllers/page.js');

/**
 * Get home page
 */
router.route('/').get(PageController.index);

/**
 * Get Other pages
 */
router.route('/:slug').get(PageController.getPage);

// export
module.exports = router;