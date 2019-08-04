/*
* Qusetions router
*
*/

//Dependencies
const controller = require ('../controllers/topics.js');
const express = require ('express');
const {upload} = require ('../lib/fileUploader');
const auth = require ('../middleware/auth');
const router = express.Router ();

router.post ('/topics/create', auth (true, 'green'), controller.create);
router.put ('/topics/update/:id', auth (true, 'green'), controller.update);
router.delete ('/topics/delete/:id', auth (true, 'green'), controller.delete);
router.get ('/note/:id', auth (true, 'green'), controller.get);
router.get ('/topics/all', auth (true, 'green'), controller.getAll);

//Exporting the router
module.exports = router;
