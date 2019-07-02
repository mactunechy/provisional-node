/*
* Authentication middleware
*/


//Dependencies
const jwt = require('jsonwebtoken');
const config = require('../lib/config');
const jwtDecoder = require('jwt-decode');



module.exports = (authRequired,clearanceLevels = []) => {
	if(typeof clearanceLevels === 'string' ) clearanceLevels = [clearanceLevels];

	//if route doesnt require authentication ..
	if(!authRequired) return (req,res,next) => next ()
	
	//check if user is authenticated...
	return async (req,res,next) => {
		let token = req.header('x-auth-token') || req.query.token;
		if(!token) return res.status(401).send({error:'Not authorised'});
		try{
			let tokenIsValid = await jwt.verify(token,config.hashingSecret)
			if(!tokenIsValid) return  res.sendStatus(401);
			var tokenData = await jwtDecoder(token);

			//check for sercurity clearance...
			if(clearanceLevels.indexOf(tokenData.clearance)) return res.sendStatus(401)
			req.token = tokenData;
			next();

		}catch(ex){
			console.log("failed to validate token...");
			return res.status(401).send({error:'Not authorised'});
		}
	
	
	}
}