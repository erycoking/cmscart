const Joi = require('@hapi/joi');
const {Schemas} = require('./helpers/validation-helpers');

// get page model
const Page = require('../models/page');

module.exports = {
  index: (req, res, next) => {
    Page.find({}).sort({ sorting: 1}).exec((err, page) => {
      res.render('admin/pages', {
        pages: page
      })
    });
  },

  reorderPages: (req, res, next) => {
    const ids = req.body['id[]'];

    let count = 0;
    
    for(let i = 0; i < ids.length; i++) {
      const id = ids[i];
      count++;

      (function(count) {
        Page.findById(id, (err, page) => {
          page.sorting = count;
          page.save((err) => {
            if(err) 
              return console.log(err);
          })
        });
      })(count);
    }
  },

  read: (req, res, next) => {
    return res.render('admin/add_page', {
      errors: null,
      title: '',
      slug: '',
      content: ''
    });
  },

  create: (req, res, next) => {
    const { error, value } = Schemas.pageSchema.validate(req.body);
    if (error) {
      req.flash('danger', error.details[0].message);
      res.render('admin/add_page', {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content
      });
    } else {
      Page.findOne({slug: req.body.slug}, (err, page) => {
        if (page) {
          req.flash('danger', 'slug already in use');
          res.render('admin/add_page', {
            title: value.title,
            slug: value.slug,
            content: value.content
          });
        } else {
          page = new Page({
            title: value.title,
            slug: (value.slug !== '') ? value.slug.replace(/\s+/g, '-').toLowerCase() : value.title.replace(/\s+/g, '-').toLowerCase(),
            content: value.content,
            sorting: 100
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
  },

  edit: (req, res, next) => {
    Page.findOne({ slug: req.params.slug}, (err, page) => {
      if (err) 
        return console.log(err);

      res.render('admin/edit_page', {
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
      res.render('admin/edit_page', {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        id: req.body.id
      });

    } else {
      Page.findOne({slug: req.body.slug, _id: { '$ne':req.body.id }}, (err, page) => {
        if (page) {
          req.flash('danger', 'slug already in use');
          res.render('admin/edit_page', {
            title: value.title,
            slug: value.slug,
            content: value.content,
            id: value.id
          });
        } else {
          Page.findById({ _id: value.id}, (err, page) => {
            if (err) 
              return console.log(err);

            page.title = value.title;
            page.slug = (value.slug !== '') ? value.slug.replace(/\s+/g, '-').toLowerCase() : value.title.replace(/\s+/g, '-').toLowerCase();
            page.content = value.content;
  
            page.save((err) => {
              if (err) {
                req.flash('danger', err);
              } else {
                req.flash('success', 'Page added successfully!');
                res.redirect(`/admin/pages/edit-page/${page.slug}`);
              }
            });
          });
        }
      });
    }
  },

  delete: (req, res, next) => {
    console.log(req.params);
    Page.findByIdAndDelete(req.params.id, (err) => {
      if (err)
        return console.log(err);

        req.flash('success', 'Page deleted successfully!');
        res.redirect(`/admin/pages`);
    });
  }
}