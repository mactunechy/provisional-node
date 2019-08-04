const Joi = require ('joi');

const schema = {
  description: Joi.string ().min (3).max (500).required (),
  topic: Joi.string ().min (3).max (500).required (),
  diagram: Joi.string ().min (3).max (1000),
  example: Joi.string ().min (3).max (1000),
};

module.exports = function (notes) {
  return Joi.validate (notes, schema);
};
