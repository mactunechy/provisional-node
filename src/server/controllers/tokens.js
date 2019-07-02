/**
 * * Tokens Controllers 
 */


 //Dependencies
 const Token = require("../models/Token");
 const validator = require("../models/Token/validator")

 //container of the module
 const lib = {};

 lib.create = async (req,res) => {
     const details = req.body
     //TODO : make payment if the pricing is not free
     lib.makePayment(details).then( data => {
         let valid = validator(data)
        if(valid.error) return res.status(400).send({ error : "Missing required fields"})
        Token.create(data).then( token => {
            return res.status(200).send(token)
        })
        .catch( error => {
            console.log("error",error)
            return sendStatus(500)
        })
     })
     .catch( ex => {
         console.log('ex', ex)
         return res.sendStatus(500)

     })
     
 }

 //Make payment
 lib.makePayment = (details) => {
     return new Promise((resolve, reject) => {
          details.expiresAt = Date.now() + (1000 * 60 * 60 * 24 * 7 )
         if(details.pricing === 'free') return resolve(details)
     });
 }


 //Retreving a specific user
lib.getToken = async (req,res) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let token = await Token.findById(id).catch( ()=> console.log('failed to get Token') );

    if(!token) return res.sendStatus(404);
    res.status(200).send(token);
     

};


//Retreving a specific user
lib.getTokens = async (req,res) => {
    //Required data
    let tokens = await Token.find({}).catch( ()=> console.log('failed to get tokens') );
    if(!tokens) return res.sendStatus(404);
    
    res.status(200).send(tokens);

};

//Updating  Token
lib.updateToken = async (req,res,next) => {
    const details = req.body
    const { id } = req.params
    if(!id) return res.status(400).send({error : 'Missing required fields'})
    const valid = validator(details);
     if(valid.error) return res.status(400).send({ error : "Invalid data format"})
    //save the new user date
    let token = await Token.findByIdAndUpdate(id,details,{new:true});
    if(!token) return res.sendStatus(404);
    return res.status(200).send(token);
        

};

//Delete a Token
lib.deleteToken = async (req,res,next) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;
    if(id){
        let token = await Token.findByIdAndRemove(id).catch( () => console.log("failed to get token"));
        if(!token) return res.sendStatus(404);
        
        res.status(200).send(token)
    }else{
     return	res.status(400).json({error:'Missing Required fields'})
    }
};






 //Exportations of tge module
 module.exports = lib