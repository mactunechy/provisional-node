/*
* Qusetions router
*
*/

//Dependencies
const controller = require ('../controllers/questions.js');
const express = require ('express');
const auth = require ('../middleware/auth');
const router = express.Router ();
const {upload} = require ('../lib/fileUploader');

router.post (
  '/questions/create',
  auth (true, 'green'),
  upload.single ('file'),
  controller.create
);
router.post ('/question/mark/:id', auth (true, 'green'), controller.mark);
router.put (
  '/questions/update/:id',
  auth (true, 'green'),
  upload.single ('file'),
  controller.updateQuestion
);
router.delete (
  '/questions/delete/:id',
  auth (true, 'green'),
  controller.deleteQuestion
);
router.get ('/question/:id', auth (true, 'green'), controller.getQuestion);
router.get ('/questions/all', auth (true, 'green'), controller.getQuestions); //@TODO add auth

//Exporting the router
module.exports = router;
