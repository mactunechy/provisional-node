const Joi = require ('joi');

const schema = {
  label: Joi.string ().min (3).max (255).required (),
  property: Joi.string ().min (3).max (255).required (),
  notes: Joi.array (),
  questions: Joi.array (),
};

module.exports = function (topic) {
  return Joi.validate (topic, schema);
};
