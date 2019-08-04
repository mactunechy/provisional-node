/*
* Ping router
*/

//Depnendincies
const express = require('express');
const { upload, uploadOnline } = require('../lib/fileUploader')

const router = express.Router();

router.get('/ping',(req,res,next) => {
	res.send('Server is up');
});
router.post('/test-upload',upload.single('file'),(req,res,next) => {
	let a = req.file.originalname.split('.')
	let fileName = `dellan-profile.${a[a.length-1]}`
	 uploadOnline(fileName,req.file.buffer).then( location =>res.send({location}))
	.catch(err => {
		console.log(err)
		return res.sendStatus(500)
	})
});







//Exporting the router
module.exports = router;