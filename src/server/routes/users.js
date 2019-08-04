/*
* User router
*
*/

//Dependencies
const controller = require ('../controllers/users.js');
const express = require ('express');
const validateEmail = require ('../middleware/validateEmail');
const auth = require ('../middleware/auth');
const router = express.Router ();
const {upload} = require ('../lib/fileUploader');

router.post (
  '/accounts/create',
  upload.single ('file'),
  validateEmail,
  controller.createUser
);
router.post ('/accounts/create/confirm', controller.confirmAccountCreation);
router.put (
  '/accounts/update',
  auth (true, 'green'),
  upload.single ('file'),
  controller.updateUser
);
router.delete ('/accounts/delete/:id', controller.deleteUser);
router.get ('/accounts/me/:id', auth (true, 'green'), controller.getUser);
router.get ('/accounts/all', auth (true, 'green'), controller.getUsers); //@TODO add auth
router.post ('/accounts/login', controller.loginUser);
router.put ('/accounts/renew/token', auth, controller.renewToken);

//Exporting the router
module.exports = router;
