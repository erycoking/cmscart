const { check, validationResult } = require('express-validator');

module.exports = {
  index: async (req, res, next) => {
    res.status(200).json('working');
  }
}