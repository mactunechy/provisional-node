/**
 *  *Processes files, images before they're saved
 */

//TODO add the cpUploads as a middleware to the path that uploads the file


//Dependencies
const multer = require("multer");
const path = require("path");




//File storage..
const destination = path.join(__dirname,"/../uploads");

var storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,destination)
    },
    filename : function (req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + file.mimetype.replace('image/','.'))
    }
})
var upload = multer({storage : storage})

var cpUploads = upload.fields([{name : "gallery", maxCount : 5 },{ name : "thumbnail", maxCount : 1}])


module.exports = cpUploads;