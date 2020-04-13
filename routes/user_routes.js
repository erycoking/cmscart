const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.js');

router.route('/').get(UserController.index);

// export
module.exports = router;