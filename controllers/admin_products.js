const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');


// get page model
const Product = require('../models/product');

// get Category model
const Category = require('../models/category');

module.exports = {
  index: (req, res, next) => {
    let count;
    Product.countDocuments((err, c) => {
      if (err)
        return console.log(err);
      count = c;
    });

    Product.find((err, products) => {
      if (err)
        return console.log(err);

      res.render('admin/products/products', {
        products: products,
        count: count
      });
   
    })
  },

  create: (req, res, next) => {
    Category.find((err, cats) => {
      return res.render('admin/products/add_product', {
        title: '',
        desc: '',
        categories: cats,
        price: ''
      });
    })
  },

  add: (req, res, next) => {
    const imageAvailable = req.files !== null && req.files.image !== undefined ? true : false;
    const imageFile = imageAvailable ? req.files.image.name : '';
    const { error, value } = Schemas.ProductSchema.validate(req.body);
    const imageCheck = imageAvailable ? Schemas.isValidImage(req.files.image) : false;

    if (error) {
      req.flash('danger', error.details[0].message);
      Category.find((err, cats) => {
        res.render('admin/products/add_product', {
          title: req.body.title,
          desc: req.body.desc,
          category: req.body.category,
          categories: cats,
          price: req.body.price
        });
      });
    } else if(imageCheck) {
      req.flash('danger', 'Invalid image, only .jpg, .jpeg and .png images allowed, max upload size is 5mb');
      Category.find((err, cats) => {
        res.render('admin/products/add_product', {
          title: req.body.title,
          desc: req.body.desc,
          category: req.body.category,
          categories: cats,
          price: req.body.price
        });
      });
    } else {
      Product.findOne({slug: req.body.slug}, (err, product) => {
        if (product) {
          req.flash('danger', 'Product title already in use, choose another');
          Category.find((err, cats) => {
            res.render('admin/products/add_product', {
              title: req.body.title,
              desc: req.body.desc,
              category: req.body.category,
              categories: cats,
              price: req.body.price
            });
          });
        } else {
          product = new Product({
            title: value.title,
            slug: value.title.replace(/\s+/g, '-').toLowerCase(),
            desc: value.desc,
            category: value.category,
            price: value.price,
            image: imageFile
          });

          product.save((err) => {
            if (err) 
              req.flash('danger', err);

            mkdirp(`public/product_images/${product._id}/gallery/thumbs`).then(() => {
              if (imageAvailable) {
                const productImage = req.files.image;
                const imagePath = './public/product_images/' + product._id + '/' + imageFile;
  
                productImage.mv(imagePath).then(() => {
                  console.log('file successfully uploaded');
                }).catch((err) => {
                  console.log('=============================');
                  console.log(err);
                  console.log('=============================');
                  return;
                });
              }
            }).catch((err) => {
              return console.log(err);
            });

            req.flash('success', 'Product added successfully!');
            res.redirect('/admin/products');
          });
        }
      });
    }
  },

  edit: (req, res, next) => {
    Page.findOne({ _id: req.params.id}, (err, page) => {
      if (err) 
        return console.log(err);

      res.render('admin/pages/edit_page', {
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
      });
    });
  },

  update: (req, res, next) => {
    const { error, value } = Schemas.editPageSchema.validate(req.body);
    if (error) {
      req.flash('danger', error.details[0].message);
      res.render('admin/pages/edit_page', {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        id: req.params.id
      });

    } else {
      Page.findOne({slug: req.body.slug, _id: { '$ne':req.params.id }}, (err, page) => {
        if (page) {
          req.flash('danger', 'slug already in use');
          res.render('admin/pages/edit_page', {
            title: value.title,
            slug: value.slug,
            content: value.content,
            id: req.params.id
          });
        } else {
          Page.findById({ _id: req.params.id}, (err, page) => {
            if (err) 
              return console.log(err);

            page.title = value.title;
            page.slug = (value.slug !== '') ? value.slug.replace(/\s+/g, '-').toLowerCase() : value.title.replace(/\s+/g, '-').toLowerCase();
            page.content = value.content;
  
            page.save((err) => {
              if (err) {
                req.flash('danger', err);
              } else {
                req.flash('success', 'Page updated successfully!');
                res.redirect(`/admin/pages/edit-page/${page._id}`);
              }
            });
          });
        }
      });
    }
  },

  delete: (req, res, next) => {
    Product.findByIdAndDelete(req.params.id, (err) => {
      if (err)
        return console.log(err);

        req.flash('success', 'Product deleted successfully!');
        res.redirect(`/admin/products`);
    });
  }
}