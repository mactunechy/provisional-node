/*
* Qusetions router
*
*/

//Dependencies
const controller = require ('../controllers/notes.js');
const express = require ('express');
const {upload} = require ('../lib/fileUploader');
const auth = require ('../middleware/auth');
const router = express.Router ();

router.post (
  '/notes/create',
  auth (true, 'green'),
  upload.single ('file'),
  controller.create
);
router.put (
  '/notes/update/:id',
  auth (true, 'green'),
  upload.single ('file'),
  controller.updateNotes
);
router.delete (
  '/notes/delete/:id',
  auth (true, 'green'),
  controller.deleteNotes
);
router.get ('/note/:id', auth (true, 'green'), controller.getNotes);
router.get ('/notes/all', auth (true, 'green'), controller.getAll);

//Exporting the router
module.exports = router;
