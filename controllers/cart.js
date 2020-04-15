const fs = require('fs-extra');

// get product model
const Product = require('../models/product');

// get category model
const Category = require('../models/category');

module.exports = {
  index: (req, res, next) => {
    
  },

  addProductToCart: (req, res, next) => {
    const slug = req.params.product;

    Product.findOne({ slug: slug }, (err, p) => {
      if (err)
        console.log(err);

      if(!req.session.cart) {
        req.session.cart = [];
        req.session.cart.push({
          title: slug,
          qty: 1,
          price: parseFloat(p.price).toFixed(2),
          image: `/product_images/${p._id}/${p.image}`
        });
      } else {
        let cart = req.session.cart;
        let newItem = true;

        for (let i = 0; i < cart.length; i++) {
          if (cart[i].title === slug) {
            cart[i].qty++;
            newItem = false;
            break;
          }
        }

        if (newItem) {
          cart.push({
            title: slug,
            qty: 1,
            price: parseFloat(p.price).toFixed(2),
            image: `/product_images/${p._id}/${p.image}`
          });
        }
      }

      // console.log(req.session.cart);
      req.flash('success', 'Product added!');
      res.redirect('back');
    });
  },

  checkout: (req, res, next) => {
    if (req.session.cart && req.session.cart.length === 0) {
      delete req.session.cart;
      res.redirect('/cart/checkout');
    } else {
      res.render('checkout', {
        title: 'Checkout',
        cart: req.session.cart
      });
    }
  },

  updateCart: (req, res, next) => {

    const action = req.query.action;
    const slug = req.params.product;

    Product.findOne({ slug: slug }, (err, p) => {
      if (err)
        console.log(err);

      let cart = req.session.cart;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === slug) {
          switch(action) {
            case 'add':
              cart[i].qty++;
              break;
            case 'remove':
              cart[i].qty--;
              if (cart[i].qty < 1) { cart.splice(i, 1); }
              break;
            case 'clear':
              cart.splice(i, 1);
              if (cart.length === 0) { delete req.session.cart; }
              break;
            default:
              console.log('update problem');
              break;
          }
          break;
        }
      }

      // console.log(req.session.cart);
      req.flash('success', 'Cart updated!');
      res.redirect('/cart/checkout');
    });
  },

  clearCart: (req, res, next) => {
    delete req.session.cart;
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');
  },
  
}