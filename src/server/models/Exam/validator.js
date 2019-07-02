const Joi = require('joi')

const schema = {
    student: Joi.string().min(3).max(30).required(),
    score : Joi.object().keys({
        total : Joi.number().min(0).max(25),
        grade : Joi.string().min(4).max(4)
    }),
    questions : Joi.array()
    
}


module.exports = function(exam){
    return Joi.validate(exam,schema)
}