const fs = require('fs-extra');

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

  getProductDetails: (req, res, next) => {

    let galleryImages = null

    Product.findOne({ slug: req.params.product }, (err, p) => {
      if (err)
        console.log(err);

      const path = `./public/product_images/${p._id}/gallery`;
      fs.readdir(path, (err, files) => {
        if (err)
          console.log(err);

        galleryImages = files;

        res.render('products', {
          title: p.title,
          p: p,
          galleryImages: galleryImages
        })
      })
    })
  }
}