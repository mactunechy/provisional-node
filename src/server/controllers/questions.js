/**
 * * Questions Controllers 
 */


 //Dependencies
 const Question = require("../models/Question");
 const validator = require("../models/Question/validator")

 //container of the module
 const lib = {};

 lib.create = (req,res) => {
     const details = req.body
     const valid = validator(details);
     console.log("valid",valid)
     if(valid.error) return res.status(400).send({ error : "Missing required fields"})
     Question.create(details).then( question => {
         return res.status(200).send(question)
     })
     .catch( error => {
         console.log("error",error)
         return sendStatus(500)
     })
 }

 //Retreving a specific user
lib.getQuestion = async (req,res) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let question = await Question.findById(id).catch( ()=> console.log('failed to get Question') );

    if(!question) return res.sendStatus(404);
    res.status(200).send(question);
     

};
lib.mark = async (req,res) => {
    //Required data
    let {id} = req.params;
    let { answer } = req.body;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let question = await Question.findById(id).catch( ()=> console.log('failed to get Question') );

    if(!question) return res.sendStatus(404);
    const mark = await question.mark(answer);
    return res.status(200).send(mark)
     

};

//Retreving a specific user
lib.getQuestions = async (req,res) => {
    //Required data
    let questions = await Question.find({}).catch( ()=> console.log('failed to get questions') );
    if(!questions) return res.sendStatus(404);
    
    res.status(200).send(questions);

};

//Updating  Question
lib.updateQuestion = async (req,res,next) => {
    const details = req.body
    const { id } = req.params
    if(!id) return res.status(400).send({error : 'Missing required fields'})
    const valid = validator(details);
     if(valid.error) return res.status(400).send({ error : "Invalid data format"})
    //save the new user date
    let question = await Question.findByIdAndUpdate(id,details,{new:true});
    if(!question) return res.sendStatus(404);
    return res.status(200).send(question);
        

};

//Delete a Question
lib.deleteQuestion = async (req,res,next) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;
    if(id){
        let question = await Question.findByIdAndRemove(id).catch( () => console.log("failed to get question"));
        if(!question) return res.sendStatus(404);
        
        res.status(200).send(question)
    }else{
     return	res.status(400).json({error:'Missing Required fields'})
    }
};






 //Exportations of tge module
 module.exports = lib