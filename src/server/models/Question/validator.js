const Joi = require ('joi');

const schema = {
  description: Joi.string ().min (3).max (255).required (),
  topic: Joi.string ().min (3).max (255).required (),
  diagram: Joi.string ().min (3).max (255),
  correctAnswer: Joi.object ().keys ({
    letter: Joi.string ().min (1).required (),
    description: Joi.string ().min (3).max (255).required (),
  }),
  multipleChoice: Joi.array ().items (
    Joi.object ().keys ({
      letter: Joi.string ().min (1).required (),
      description: Joi.string ().min (3).required (),
    })
  ),
};

module.exports = function (question) {
  return Joi.validate (question, schema);
};
