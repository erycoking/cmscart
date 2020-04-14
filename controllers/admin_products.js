const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');


// get product model
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
        description: '',
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
          description: req.body.description,
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
          description: req.body.description,
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
              description: req.body.description,
              category: req.body.category,
              categories: cats,
              price: req.body.price
            });
          });
        } else {
          product = new Product({
            title: value.title,
            slug: value.title.replace(/\s+/g, '-').toLowerCase(),
            description: value.description,
            category: value.category,
            price: parseFloat(value.price).toFixed(2),
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

    let errors = null;
    if (req.session.errors) {
      errors = req.session.errors;
    }
    req.session.erros = null;

    Category.find((err, cats) => {
      if (err) 
        return console.log(err);

      Product.findById(req.params.id, (err, product) => {
        if (err) 
          return console.log(err);

        const gallery = `public/product_images/${product._id}/gallery`;
        let galleryImages = null;

        fs.readdir(gallery, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;
          }

          return res.render('admin/products/edit_product', {
            errors: errors,
            title: product.title,
            description: product.description,
            category: product.category.replace(/\s+/g, '-').toLowerCase(),
            categories: cats,
            price: product.price,
            image: '',
            currentImage: product.image,
            id: product._id,
            galleryImages: galleryImages
          });
        });
      });
    })
  },

  update: (req, res, next) => {
    const imageAvailable = req.files !== null && req.files.image !== undefined ? true : false;
    const imageFile = imageAvailable ? req.files.image.name : '';
    const { error, value } = Schemas.ProductSchema.validate(req.body);
    const imageCheck = imageAvailable ? Schemas.isValidImage(req.files.image) : false;

    if (error) {
      req.flash('danger', error.details[0].message);
      Category.find((err, cats) => {
        Product.findById(req.params.id, (err, product) => {
          if (err) 
            return console.log(err);
  
          const gallery = `public/product_images/${product._id}/gallery`;
          let galleryImages = null;

          fs.readdir(gallery, (err, files) => {
            if (err) {
              console.log(err);
            } else {
              galleryImages = files;
            }

            res.render('admin/products/edit_product', {
              title: req.body.title,
              description: req.body.description,
              category: req.body.category,
              categories: cats,
              price: req.body.price,
              image: '',
              currentImage: product.image,
              id: product._id,
              galleryImages: galleryImages
            });
          });
        });
      });
    } else if(imageCheck) {
      req.flash('danger', 'Invalid image, only .jpg, .jpeg and .png images allowed, max upload size is 5mb');
      Category.find((err, cats) => {
        Product.findById(req.params.id, (err, product) => {
          if (err) 
            return console.log(err);
  
          const gallery = `public/product_images/${product._id}/gallery`;
          let galleryImages = null;

          fs.readdir(gallery, (err, files) => {
            if (err) {
              console.log(err);
            } else {
              galleryImages = files;
            }

            res.render('admin/products/edit_product', {
              title: req.body.title,
              description: req.body.description,
              category: req.body.category,
              categories: cats,
              price: req.body.price,
              image: '',
              currentImage: product.image,
              id: product._id,
              galleryImages: galleryImages
            });
          });
        });
      });
    } else {
      const slug = value.title.replace(/\s+/g, '-').toLowerCase();
      Product.findOne({slug: slug, _id: { '$ne':req.params.id }}, (err, product) => {
        if (product) {
          req.flash('danger', 'Product title exists, choose another');
          Category.find((err, cats) => {

            const gallery = `public/product_images/${product._id}/gallery`;
            let galleryImages = null;

            fs.readdir(gallery, (err, files) => {
              if (err) {
                console.log(err);
              } else {
                galleryImages = files;
              }

              res.render('admin/products/edit_product', {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                categories: cats,
                price: req.body.price,
                image: '',
                currentImage: product.image,
                id: product._id,
                galleryImages: galleryImages
              });
            });
          });
        } else {
          Product.findById(req.params.id, (err, product) => {
            if (err) 
              return console.log(err);

            const oldFileName = product.image;

            product.title = value.title;
            product.slug = slug;
            product.description = value.description;
            product.category = value.category;
            product.image = (imageAvailable) ? imageFile : oldFileName;
            product.price = parseFloat(value.price).toFixed(2);
  
            product.save((err) => {
              if (err) 
                req.flash('danger', err);
  
              if (imageAvailable) {

                const oldImagePath = './public/product_images/' + product._id + '/' + oldFileName;
                fs.remove(oldImagePath)
                  .then(() => { return console.log('old image successfully deleted.'); })
                  .catch((e) => { return console.log(e); });

                const productImage = req.files.image;
                const imagePath = './public/product_images/' + product._id + '/' + imageFile;
  
                productImage.mv(imagePath).then(() => {
                  console.log('new image successfully uploaded.');
                }).catch((err) => {
                  console.log('=============================');
                  console.log(err);
                  console.log('=============================');
                  return;
                });
              }
  
              req.flash('success', 'Product updated successfully!');
              res.redirect(`/admin/products/edit-product/${product._id}`);
            });
          });
        }
      });
    }
  },

  delete: (req, res, next) => {

    const id = req.params.id;
    const path = `public/product_images/${id}`;

    fs.remove(path, (err) => {
      if (err) {
        console.log(err);
      } else {
        Product.findByIdAndDelete(req.params.id, (err) => {
          if (err)
            return console.log(err);
    
            req.flash('success', 'Product deleted successfully!');
            res.redirect(`/admin/products`);
        });
      }
    });
  },

  addImageToGallery: (req, res, next) => {
    const productIMage = req.files.file;
    const id = req.params.id;
    const path = `./public/product_images/${id}/gallery/${productIMage.name}`; 
    const thumbsPath = `./public/product_images/${id}/gallery/thumbs/${productIMage.name}`;

    productIMage.mv(path).then(() => {
      console.log('image uploaded to gallery');
      resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then((buff) => {
        console.log('thumbnails sucessfully created.');
        fs.writeFileSync(thumbsPath, buff);
      })
    }).catch((err) => {
      console.log(err);
    });

    res.sendStatus(200);
  },

  deleteImageFromGallery: (req, res, next) => {
    const image = req.params.image;
    const id = req.query.id;
    const originalIMage = `./public/product_images/${id}/gallery/${image}`; 
    const thumbsImage = `./public/product_images/${id}/gallery/thumbs/${image}`;

    fs.remove(originalIMage, (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.remove(thumbsImage, (err) => {
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'Image successfully deleted!');
            res.redirect(`/admin/products/edit-product/${id}`);
          }
        });
      }
    });
  }
}