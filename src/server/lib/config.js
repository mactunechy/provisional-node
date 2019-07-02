/*
* All enviroments configurations
*/


//Dependencies


//Container of the module

const environments = {};


//development enviroment
environments.development = {
	envName:'development',
	port:7000,
	hashingSecret:'stagingSecret',
	origin:'http://localhost:7000',//TODO: change to 3000
	globals : {
		appName : 'AppName',
		origin : 'http://localhost:7000/'
	},
	mongoDB:{
		uri:'mongodb://localhost/appName'
	},
	company : {
		infoEmail : 'info@appName.com',
	},
	allowedOrigins : ["http://localhost:3000"],
	thirdPartyEndpoints : {
    	
	},
	clearance : {
		Purple : 'Purple',
		Green :'Green',
		Yellow : 'Yellow'
	},
	//* Pricing is on a per week bases
	pricing : {
		free : {
			maxExams : 3
		},
		professional : {
			maxExams : 7
		},
		enteprise : {
			maxExams : 'unlimited'
		},
	}

};



//production enviroment
environments.production = {
	envName:'production',
	port:7000,
	origin:'https://backend.breezerentals.gr',
	globals : {
		appName : 'AppName',
		origin : ''
	},
	hashingSecret:'prodSecret',
	mongoDB:{
		uri:`mongodb+srv://mactunechy:${process.env.db_password}@firstcluster-ueynt.mongodb.net/provisional?retryWrites=true&w=majority`
	},
	company : {
		infoEmail : ''
	},	
	thirdPartyEndpoints : {
		
    	
	}
};


//choosing an enviroment
var inputEnv = typeof  process.env.NODE_ENV == 'string' && process.env.NODE_ENV.trim().length > 0 ?process.env.NODE_ENV.trim():'';

//enviroment to export
var chosenEnv = typeof  environments[inputEnv] !== 'undefined' ?  environments[inputEnv]:environments.development;


//exporting environment
module.exports = chosenEnv;






