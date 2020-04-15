const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username}, (err, user) => {
      if(err)
        console.log(err);

      if (!user) {
        return done(null, false, 'Wrong username or password!!!');
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err)
          console.log(err);

        if (isMatch) {
          done(null, user);
        } else {
          return done(null, false, 'Wrong username or password!!!');
        }
      });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
      done(err, user);
    })
  });
}



