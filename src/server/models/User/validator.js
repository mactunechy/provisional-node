const Joi = require ('joi');

const schema = {
  firstName: Joi.string ().alphanum ().min (3).max (30).required (),
  lastName: Joi.string ().alphanum ().min (3).max (30).required (),
  phone: Joi.string ().alphanum ().min (10).max (30).required (),
  profileImage: Joi.string ().alphanum ().min (3),
  clearance: Joi.string ().alphanum ().min (3).max (30),
  password: Joi.string ().regex (/^[a-zA-Z0-9]{3,30}$/).required (),
  email: Joi.string ().email ({minDomainAtoms: 2}),
};

module.exports = function (user) {
  return Joi.validate (user, schema);
};
