/**
 * @author Erick Loningo Lomunyak
 * @date 11 04 2020
 */

const express = require('express');
const path = require('path');

// setting up database
const mongoose = require('mongoose');
const config = require('./config/database');
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

// Init APP
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Up public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, () => {
  console.info(`Server running on http://localhost:${port} [${env}]`);
});