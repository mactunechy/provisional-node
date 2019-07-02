/**
 * getting access according the current access token
 */


 //Dependencies 
 const Token = require('../models/Token')


 module.exports = async function(req,res,next){
     tokenData = await Token.findOne({_id : req.token.accessToken}).catch(ex => {
         console.log(ex)
         return res.status(401).send({ error : "Not authorised" })
     })
     let verification = tokenData.verify()
     if(verification.expired) return res.status(401).send({ error : 'access token expired'})
     if(verification.isMaxExams) return res.status(401).send({ error : 'number of exams for this week exhausted'})
     req.accessToken = tokenData
     next()
 }