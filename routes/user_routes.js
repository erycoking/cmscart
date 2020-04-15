const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.js');

/**
 * Registration
 */
router.route('/register')
  .get(UserController.getRegistrationPage)  // display login page
  .post(UserController.register); // register user

/**
 * Authentication
 */
router.route('/login')
  .get(UserController.getLogin)
  .post(UserController.login);

/**
 * Logout
 */
router.route('/logout').get(UserController.logout)

// export
module.exports = router;