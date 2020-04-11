const { check, validationResult } = require('express-validator');

module.exports = {
  index: async (req, res, next) => {
    res.render('index', {
      title: 'king'
    });
  }
}