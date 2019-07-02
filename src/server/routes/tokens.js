/*
* Qusetions router
*
*/


//Dependencies
const controller = require('../controllers/tokens.js');
const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/tokens/create',auth(true,"green"),controller.create);
router.put('/tokens/update/:id',auth(true,"green"),controller.updateToken);
router.delete('/tokens/delete/:id',auth(true,"green"),controller.deleteToken);
router.get('/token/:id',auth(true,"green"),controller.getToken);
router.get('/tokens/all',auth(true,"green"),controller.getTokens); //@TODO add auth




//Exporting the router
module.exports = router;