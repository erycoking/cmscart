const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');

// get product model
const Product = require('../models/product');

// get category model
const Category = require('../models/category');

module.exports = {
  index: (req, res, next) => {
    Product.find((err, products) => {
      res.render('all_products', {
        title: 'All products',
        products: products
      });
    });
  },

  getProductsByCategory: (req, res, next) => {
    const categorySlug = req.params.c_slug;
    Category.findOne({ slug: categorySlug }, (err, c) => {
      Product.find({ category: c.slug}, (err, p) => {
        if (err)
          console.log(err);

        res.render('cat_products', {
          title: c.title,
          products: p
        });
      });
    });
  },
}