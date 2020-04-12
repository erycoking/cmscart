/**
 * @author Erick Loningo Lomunyak
 * @date 11 04 2020
 */

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const expressMessages = require('express-messages');

// setting up database
const mongoose = require('mongoose');
const config = require('./config/database');
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

// Init APP
const app = express();
app.use(logger('dev'))

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Up public folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// express session middleware
app.use(session({
  secret: 'awesome coders',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// express message middleware
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});


// configure all routes
// admin routes
const adminRoutes = require('./routes/admin-routes.js');
app.use('/admin/pages', adminRoutes);

// user routes
const userRoutes = require('./routes/user-routes.js');
app.use('/', userRoutes);

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, () => {
  console.info(`Server running on http://localhost:${port} [${env}]`);
});