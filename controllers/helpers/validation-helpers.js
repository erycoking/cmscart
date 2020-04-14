const Joi = require('@hapi/joi');
const path = require('path');

module.exports = {
  validateParams: (schema, name) => {
    return (req, res, next) => {
      const { error, value } = Schema.validate({param: req['params'][name]});
      if (error) {
        return res.status(400).json(error)
      } else {
        if (!req.value) {
          req.value = {};
        }

        if (!req.value['params']) {
          req.value['params'] = {};
        }

        req.value['params'][name] = value.param;
        next();
      }
    }
  },

  validateBody: (schema) => {
    return (req, res, next) => {
      const { error, value } = Schema.validate(req.body);
      if (error) {
        return res.status(400).json(error)
      } else {
        if (!req.value) {
          req.value = {};
        }

        if (!req.value['body']) {
          req.value['body'] = {};
        }

        req.value['body'] = value.body;
        next();
      }
    }
  },

  Schemas: {
    pageSchema: Joi.object({
      title: Joi.string().min(3).max(100).required(),
      slug: Joi.string().min(3).max(20).allow(''),
      content: Joi.string().min(3).max(500).required(),
    }),

    editPageSchema: Joi.object({
      title: Joi.string().min(3).max(100).required(),
      slug: Joi.string().min(3).max(20).allow(''),
      content: Joi.string().min(3).max(500).required(),
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    CategoriesSchema: Joi.object({
      title: Joi.string().min(3).max(100).required()
    }),

    EditCategoriesSchema: Joi.object({
      title: Joi.string().min(3).max(100).required(),
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    ProductSchema: Joi.object({
      title: Joi.string().min(3).max(100).required(),
      description: Joi.string().min(3).max(1000).required(),
      slug: Joi.string().min(3).max(20).allow(''),
      category: Joi.string().min(3).max(100).required(),
      price: Joi.number().precision(2).positive().required()
    }),

    EditProductSchema: Joi.object({
      title: Joi.string().min(3).max(100).required(),
      desc: Joi.string().min(3).max(1000).required(),
      slug: Joi.string().min(3).max(20).allow(''),
      category: Joi.string().min(3).max(100).required(),
      price: Joi.number().precision(2).positive().required(),
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    isValidImage: (image) => {
      const imageFileName = image.name;
      const allowedImageExtensions = ['jpg', 'jpeg', 'png'];
      const extension = (path.extname(imageFileName)).toLowerCase();
      return allowedImageExtensions.findIndex((e) => e === extension) !== -1 && image.size < 5242880;
    },

    idSchema: Joi.object({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
};