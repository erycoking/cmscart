const Page = require('../models/page');

module.exports = {
  index: (req, res, next) => {
    Page.findOne({ slug: 'home'}, (err, page) => {
      if (err)
        console.log(err);

      res.render('index', {
        title: page.title,
        content: page.content
      });
    });
  },

  getPage: (req, res, next) => {
    const slug = req.params.slug;

    Page.findOne({ slug: slug}, (err, page) => {
      if (err)
        console.log(err);

      if (!page) {
        res.redirect('/');
      } else {
        res.render('index', {
          title: page.title,
          content: page.content
        });
      }
    });
  }
}