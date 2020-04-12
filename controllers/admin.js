const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');

// get page model
const Page = require('../models/page');

module.exports = {
  index: async (req, res, next) => {
    res.status(200).json('working');
  },

  addPageForm: async (req, res, next) => {
    return res.render('admin/add_page', {
      errors: null,
      title: '',
      slug: '',
      content: ''
    });
  },

  addPage: async (req, res, next) => {
    const { error, value } = Schemas.pageSchema.validate(req.body);
    if (error) {
      console.log(error);
      res.render('admin/add_page', {
        errors: error.details,
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content
      });
    } else {
      Page.findOne({slug: req.body.slug}, (err, page) => {
        if (page) {
          req.flash('danger', 'slug is already in use');
          res.render('admin/add_page', {
            title: value.title,
            slug: value.slug,
            content: value.content
          });
        } else {
          page = new Page({
            title: value.title,
            slug: value.slug,
            content: value.content,
            sorting: 0
          });

          page.save((err) => {
            if (err) {
              req.flash('danger', err);
            } else {
              req.flash('success', 'Page added successfully!');
              res.redirect('/admin/pages');
            }
          });
        }
      });
    }
  }
}