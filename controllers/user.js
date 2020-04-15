const User = require('../models/user');
const passport  = require('passport');
const bcrypt = require('bcryptjs');
const { Schemas } = require('./helpers/validation-helpers');

module.exports = {
  getRegistrationPage: (req, res, next) => {
   res.render('register', {
     title: 'Register',
     name: '',
     username: '',
     email: '',
     password: '',
     cpassword: ''
   });
  },

  register: (req, res, next) => {
    const { error, value } = Schemas.UserSchema.validate(req.body);

    if (error) {
      req.flash('danger', error.details[0].message);
      res.render('register', {
        title: 'Register',
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });
    } else {

      User.findOne({ username: value.username}, (err, user) => {
        if (err)
          console.log(err);

        if (user) {
          req.flash('danger', 'username already taken, choose another');
          res.render('register', {
            title: 'Register',
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
          });
        } else {
          const newuser = new User({
            name: value.name,
            username: value.username,
            email: value.email,
            password: value.password,
            admin: 0
          });
    
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newuser.password, salt, (err, hash) => {
              if(err)
                console.log(err);

              newuser.password = hash;

              newuser.save((err) => {
                if(err) {
                  console.log(err);
                } else {
                  req.flash('success', 'You are now registered');
                  res.redirect('/auth/login');
                }
              });
            });
          });
        }
      });
    }

  },

  getLogin: (req, res, next) => {
   if(res.locals.user) {
     res.redirect('/');
   } else {
    res.render('login', {
      title: 'Log In',
      username: '',
      password: '',
    });
   }
  },

  login: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/auth/login');
  }
}