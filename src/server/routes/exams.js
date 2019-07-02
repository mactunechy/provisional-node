/*
* Qusetions router
*
*/


//Dependencies
const controller = require('../controllers/exams.js');
const express = require('express');
const auth = require('../middleware/auth')
const access = require('../middleware/access')

const router = express.Router()

router.post('/exams/create',auth(true,"green"),access,controller.create);
router.post('/exam/get-total/:id',auth(true,"green"),controller.getTotalScore);
router.put('/exams/update/:id',auth(true,"green"),controller.updateExam);
router.delete('/exams/delete/:id',auth(true,"green"),controller.deleteExam);
router.get('/exam/:id',auth(true,"green"),controller.getExam);
router.get('/exams/all',auth(true,"green"),controller.getExams); //@TODO add auth




//Exporting the router
module.exports = router;