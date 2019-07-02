/*
* Helper functions for different tasks
*/


//Dependencies
const crypto = require('crypto');
const config = require('./config');
// const Mailjet = require('node-mailjet').connect(config.mailjet.apiKey,config.mailjet.secretKey);
const fs = require('fs');
const path = require('path')
const uuid = require('uuid/v1');
const fsx = require('fs-extra')
// const puppeteer = require('puppeteer')
//Module container
const lib = {};

lib.hash = (str,callback) => {
	return new Promise((resolve,reject) => {
		str = typeof str == 'string' && str.length > 0 ? str : false;
		if(!str) return reject();
		let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
		return resolve(hash);
	});
	
}

lib.validateEmail = (str) =>  {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if( !re.test(str) ) return false;
		return str;
	
}

// lib.confirmSignup = (data) => {
// 	return new Promise(function(resolve,reject){
// 		data  = typeof data == 'object' && Object.keys.length > 0 ? data : false;

// 		//@TODO  create a one time link and add it to the the data brfore interpolation
// 		if(!data) return reject({error:'missing required data object'});

// 		lib.createLink(data).then(async function(link){
// 			data.link = link;
// 		//getting the email html template
// 			try{
// 				let emailTemplate = await fs.readFileSync(path.join(__dirname,'/../emails/createUser.html'),'utf8');
// 				var htmlEmail = await lib.interpolateEmail(data,'user',emailTemplate);
// 			}catch(e){
// 				console.log(e);
// 				return reject('failed to interpolate')
// 			}

		
		
// 		const emailData = {
// 			'FromEmail': config.company.infoEmail,
// 			'FromName': 'Breeze rentals',
// 			'Subject': 'Account Creation completion!',
// 			'Html-part': htmlEmail,
// 			'Recipients': [{'Email': data.email}],		
// 		  }
// 		 await lib.sendEmail(emailData)
		
// 		}).catch( err => reject(err));
// 	})
// };


// lib.sendEmail = async function(emailData){
// 	return new Promise(async function (resolve,reject) {
// 		//emailing the user
// 	const sendEmail = Mailjet.post("send",{
// 		url: config.mailjet.url,
// 		version: config.mailjet.version,
// 		 perform_api_call: true,
// 	});
// 	try{
// 		await sendEmail.request(emailData)
// 		.then(res => {
// 			console.log(res.body);
// 			//@TODO do something else with the response.
// 			return resolve({message:"Email sent to the user"})
// 		}).catch(reason => {
// 			console.log(reason)
// 			reject('Failed to send message')
// 		})
// 		return false;
// 	}catch(e){
// 		console.log(e)
// 		return ('error occured during email proccessing ')
// 	}

// 	})
	
// }

// lib.bookingEmail = async function(customer){
//  return new Promise( async function(resolve,reject){
// 	 customer = customer.toObject()
// 	 let { DateStart, DateEnd, payment, ReservationDate } = customer;
// 	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric',second:'numeric' }; 
// 	const locales = ['en-US']
// 	customer.DateStart = DateStart.toLocaleDateString(locales,options)
// 	customer.DateEnd = DateEnd.toLocaleDateString(locales,options)
// 	customer.transactionId = payment.id
// 	customer.ReservationDate = ReservationDate.toLocaleDateString(locales,options)
// 	try{
// 		let emailTemplate = await fs.readFileSync(path.join(__dirname,'/../emails/bookingComplete.html'),'utf8');
// 		var htmlEmail = await lib.interpolateEmail(customer,'customer',emailTemplate);
// 	}
// 	catch(e){
// 		console.log(e)
// 		return reject('Failed to read or interpolate email template')
// 	}
// 	const emailData = {
// 		'FromEmail': config.company.infoEmail,
// 		'FromName': 'Breeze rentals',
// 		'Subject': 'Car rental reservation complete',
// 		'Html-part': htmlEmail,
// 		'Recipients': [{'Email': customer.customeremail },{'Email': config.company.otherEmail }],		
// 	  }
// 	  const pdfFile = customer.token + '.pdf';
// 	  try{
// 		await lib.sendEmail(emailData);
// 		await lib.createVoucher(htmlEmail,pdfFile)
// 		return resolve();
// 	  }catch(e){
// 		  console.log(e)
// 		  return reject('failed to send booking confirmation email!');
// 	  }
//  })
// }


lib.interpolateEmail = function(data,objName,emailTemplate){
	return new Promise(async function(resolve,reject){
		//intepolate the the template
		for ( var key in data ){
			if( data.hasOwnProperty(key)) {
				 let find  = `{${objName}.${key}}`;
				let replace = data[key];
				emailTemplate = emailTemplate.replace( new RegExp(find,'g'),replace)
			}
		} 
		resolve(emailTemplate);
	})
}


lib.createLink = function(data){
	return new Promise(function(resolve,reject){
		//creating a random string
		const randomString = uuid();
		//add the activation key to disk
		lib.write(randomString,data).then( () => {
			const link = `${config.origin}/activateuser?key=${randomString}&id=${data._id}`;
			return resolve(link);
		}).catch( err => reject(err))
	})
}

lib.write = function(filename,data){
	return new Promise(function(resolve,reject){
		filename = typeof filename == 'string' && filename.trim().length > 0 ? filename : false;
		data = typeof data == 'object' && Object.keys(data).length > 0 ? data : false;
		if( !(filename && data)) return reject('invalid input');
		//creating file path
		const filePath = path.join(__dirname,`/../activationKeys/${filename}.json`);
		//stringify data
		string = JSON.stringify(data);
		fs.writeFile(filePath,string,'utf8',function(err){
			if(!err){
				return resolve()
			}else{
				return reject(err);
			}
		})
	})
}



//Create a pdf voucher
lib.createVoucher = async function(html,filename){
	const filePath = path.join(__dirname,`/../.data/vouchers/${filename}`) 
	try{
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setContent(html)
		await page.emulateMedia('screen');
		await page.pdf({
			path : filePath,
			format : 'A4',
			printBackground : true

		});
		await page.waitFor('*');


		await browser.close();
	}catch(e){
		return console.log('error: ',e)
	}

}

// lib.supportEmail = (data) => {
// 	return new Promise(async (resolve, reject) => {
// 		if(!data) return reject('Missing required data')
// 		try{
// 			let emailTemplate = await fs.readFileSync(path.join(__dirname,'/../emails/support.html'),'utf8');
// 			var htmlEmail = await lib.interpolateEmail(data,'customer',emailTemplate);
// 		}
// 		catch(e){
// 			console.log(e)
// 			return reject('Failed to read or interpolate email template')
// 		}
// 		const emailData = {
// 			'FromEmail': config.company.infoEmail,
// 			'FromName': `${data.firstName} ${data.lastName}`,
// 			'Subject': 'Customer from Breeze rentals',
// 			'Html-part': htmlEmail,
// 			'Recipients': [{'Email': config.company.infoEmail },{'Email': config.company.otherEmail }],		
// 		  }
// 		  try {
// 			await lib.sendEmail(emailData);
// 			return resolve()
// 		  } catch (error) {
// 			  console.log('error', error)
// 			  return reject('failed to send support email')
// 		  }
// 	});
// }




//Export the module
module.exports = lib