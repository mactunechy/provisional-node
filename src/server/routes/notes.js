/*
* Qusetions router
*
*/


//Dependencies
const controller = require('../controllers/notes.js');
const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/notes/create',auth(true,"green"),controller.create);
router.put('/notes/update/:id',auth(true,"green"),controller.updateNotes);
router.delete('/notes/delete/:id',auth(true,"green"),controller.deleteNotes);
router.get('/note/:id',auth(true,"green"),controller.getNotes);
router.get('/notes/all',auth(true,"green"),controller.getAll); //@TODO add auth




//Exporting the router
module.exports = router;