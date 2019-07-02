const Joi = require('joi')

const schema = {
    pricing: Joi.string().min(3).max(30).required(),
    expiresAt: Joi.number().required()
}


module.exports = function(user){
    return Joi.validate(user,schema)
}