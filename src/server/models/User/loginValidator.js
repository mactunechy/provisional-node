const Joi = require('joi')

const schema = {
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
}


module.exports = function(credentials){
    return Joi.validate(credentials,schema)
}