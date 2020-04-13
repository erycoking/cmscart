const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');

// get Category model
const Category = require('../models/category');

module.exports = {
  index: (req, res, next) => {
    Category.find({}).sort({ sorting: 1}).exec((err, cat) => {
      res.render('admin/categories/categories', {
        categories: cat
      })
    });
  },

  create: (req, res, next) => {
    return res.render('admin/categories/add_category', {
      title: '',
    });
  },

  add: (req, res, next) => {
    const { error, value } = Schemas.CategoriesSchema.validate(req.body);
    if (error) {
      req.flash('danger', error.details[0].message);
      res.render('admin/categories/add_category', {
        title: req.body.title,
      });
    } else {
      const newSlug = value.title.replace(/\s+/g, '-').toLowerCase();
      Category.findOne({slug: newSlug}, (err, cat) => {
        if (cat) {
          req.flash('danger', 'Category already exists');
          res.render('admin/categories/add_category', {
            title: value.title,
          });
        } else {
          cat = new Category({
            title: value.title,
            slug: value.title.replace(/\s+/g, '-').toLowerCase(),
          });

          cat.save((err) => {
            if (err) {
              req.flash('danger', err);
            } else {
              req.flash('success', 'Category added successfully!');
              res.redirect('/admin/categories');
            }
          });
        }
      });
    }
  },

  edit: (req, res, next) => {
    Category.findOne({ slug: req.params.slug}, (err, cat) => {
      if (err) 
        return console.log(err);

      res.render('admin/categories/edit_category', {
        title: cat.title,
        slug: cat.slug,
        id: cat._id
      });
    });
  },

  update: (req, res, next) => {
    const { error, value } = Schemas.EditCategoriesSchema.validate(req.body);
    if (error) {
      req.flash('danger', error.details[0].message);
      res.render('admin/categories/edit_category', {
        title: req.body.title,
        slug: req.params.slug,
        id: req.body.id
      });

    } else {
      const newSlug = value.title.replace(/\s+/g, '-').toLowerCase();
      Category.findOne({slug: newSlug, _id: { '$ne':req.body.id }}, (err, cat) => {
        if (cat) {
          req.flash('danger', 'Category already in exists');
          res.render('admin/categories/edit_category', {
            title: value.title,
            slug: req.params.slug,
            id: value.id
          });
        } else {
          Category.findById({ _id: value.id}, (err, cat) => {
            if (err) 
              return console.log(err);

            cat.title = value.title;
            cat.slug = value.title.replace(/\s+/g, '-').toLowerCase();

            cat.save((err) => {
              if (err) {
                req.flash('danger', err);
              } else {
                req.flash('success', 'Category updated successfully!');
                res.redirect(`/admin/categories/edit-category/${cat.slug}`);
              }
            });
          });
        }
      });
    }
  },

  delete: (req, res, next) => {
    console.log(req.params);
    Category.findByIdAndDelete(req.params.id, (err) => {
      if (err)
        return console.log(err);

        req.flash('success', 'Category deleted successfully!');
        res.redirect(`/admin/categories`);
    });
  }
}