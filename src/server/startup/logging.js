/*
*   Logging Errors
*/

//Dependencies
const config = require('../lib/config');
const winston = require('winston');
require('winston-mongodb');



module.exports = function(){


// //subscribing to the uncaughtException event
// winston.exceptions.handle(new winston.transports.File({filename:'../logs/unhandledExceptions.log'}))


process.on('unhandledRejections', ex => {
	throw ex;
})

//adding a logging errors file transport
winston.add(new winston.transports.Console({format:winston.format.json()}));


}

