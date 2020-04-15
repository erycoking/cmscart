/**
 * @author Erick Loningo Lomunyak
 * @date 11 04 2020
 */

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressMessages = require('express-messages');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const passportConfig = require('./config/passport');

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
app.use('/assets', [
  express.static(__dirname + '/node_modules/jquery/dist/'),
  express.static(__dirname + '/node_modules/jquery-ui-dist/'),
  express.static(__dirname + '/node_modules/@ckeditor/ckeditor5-build-classic/')
]);

// Express fileupload middleware
app.use(fileUpload());

// body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// express session middleware
app.use(session({
  secret: 'awesome coders',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// express message middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// passport config
passportConfig(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// add cart as a global variable
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

// get category Model
const Category = require('./models/category');

// load all pages
Category.find((err, categories) => {
  if (err)
    console.log(err);
  else
    app.locals.categories = categories;
});

// get page Model
const Page = require('./models/page');

// load all pages
Page.find().sort({sorting: 1}).exec((err, pages) => {
  if (err)
    console.log(err);
  else
    app.locals.pages = pages;
});

// admin pages routes
const adminPagesRoutes = require('./routes/admin_pages_routes.js');
app.use('/admin/pages', adminPagesRoutes);

// admin category routes
const adminCategoriesRoutes = require('./routes/admin_categories_routes.js');
app.use('/admin/categories', adminCategoriesRoutes);

// admin category routes
const adminProductsRoutes = require('./routes/admin_products_routes.js');
app.use('/admin/products', adminProductsRoutes);

// product routes
const productRoutes = require('./routes/product_routes.js');
app.use('/products', productRoutes);

// cart routes
const cartRoutes = require('./routes/cart_routes.js');
app.use('/cart', cartRoutes);

// user routes
const userRoutes = require('./routes/user_routes.js');
app.use('/auth', userRoutes);

// page routes
const pageRoutes = require('./routes/page_routes.js');
app.use('/', pageRoutes);

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, () => {
  console.info(`Server running on http://localhost:${port} [${env}]`);
});