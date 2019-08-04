/**
 * *Module for making file uploads to S3 backet
 */


 //Dependencies
 const multer = require('multer');
 const multerS3 = require('multer-s3');
 const aws = require('aws-sdk');
 const { s3Crendetials } = require('./config');
 const storage = multer.memoryStorage()

 
 const upload = multer({storage: storage});

 aws.config.update({
     secretAccessKey : s3Crendetials.secretKey,
     accessKeyId : s3Crendetials.accessKey,
     region: 'us-east-1'
 })
 s3 = new aws.S3();

const uploadOnline = (dir,fileName,buffer) => {
    return new Promise((resolve, reject) => {
        fileName = `${dir}/${Date.now()}-${fileName}`
    const params = {
        Bucket : 'prov-user-profile',
        Key : fileName,
        Body : buffer
    }
    s3.upload(params,(error,data)=> {
        if(error){
            console.log('error', error)
            return reject('failed to upload')
        }
        resolve(data.Location)
    })
    });
}


module.exports = {
    upload,
    uploadOnline
}




