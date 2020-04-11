const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.js');

router.route('/')
  .get(UserController.index)
  .post(() => { console.log('not handled yet'); })


// export
module.exports = router;