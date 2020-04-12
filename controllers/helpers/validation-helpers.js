const Joi = require('@hapi/joi');

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

    idSchema: Joi.object({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
};