/**
 * * Exams Controllers 
 */


 //Dependencies
 const Exam = require("../models/Exam");
 const validator = require("../models/Exam/validator");
 const Question = require('../models/Question')
 //container of the module
 const lib = {};


 lib.create = async (req,res) => {
     const decision = req.accessToken.verify()
     //make a decision whether to continue if the token is still valid
     if(!decision.expired || !decision.isMaxExams) return res.status(200).send(decision)
     const details = {};
     details.student = req.token.id
     let questions = await Question.find({}).catch( () => console.log('failed to get Questions') );
     let selectedQuestion = [];
     //Get 25 random questions 
     while(selectedQuestion.length <= 2) { //TODO : change to 25 questions
         const question = questions[Math.floor(Math.random()*questions.length)];
         if(!selectedQuestion.includes(question)) selectedQuestion.push(question._id)
     }
     details.questions = selectedQuestion

     const valid = validator(details);
     console.log('valid', valid.error)
     if(valid.error) return res.status(400).send({ error : "Missing required fields"})
     Exam.create(details).then( exam => {
         //Add this exam to the accessToken exams list
         req.accessToken.addExam(exam._id)
         return res.status(200).send(exam)
     })
     .catch( error => {
         console.log("error",error)
         return sendStatus(500)
     })
 }

 //Retreving a specific user
lib.getExam = async (req,res) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let exam = await Exam.findById(id).populate("questions").exec().catch( ()=> console.log('failed to get Exam') );

    if(!exam) return res.sendStatus(404);
    res.status(200).send(exam);
     

};
lib.getTotalScore = async (req,res) => {
    //Required data
    let {id} = req.params;
    let { score } = req.body;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let exam = await Exam.findById(id).catch( ()=> console.log('failed to get Exam') );

    if(!exam) return res.sendStatus(404);
    await exam.getTotalScore(score);
    return res.status(200).send(exam)
     

};

//Retreving a specific Exam
lib.getExams = async (req,res) => {
    //Required data
    let exams = await Exam.find({}).catch( ()=> console.log('failed to get exams') );
    if(!exams) return res.sendStatus(404);
    
    res.status(200).send(exams);

};

//Updating  Exam
lib.updateExam = async (req,res,next) => {
    const details = req.body
    const { id } = req.params
    if(!id) return res.status(400).send({error : 'Missing required fields'})
    const valid = validator(details);
     if(valid.error) return res.status(400).send({ error : "Invalid data format"})
    //save the new user date
    let exam = await Exam.findByIdAndUpdate(id,details,{new:true});
    if(!exam) return res.sendStatus(404);
    return res.status(200).send(exam);
        

};

//Delete a Exam
lib.deleteExam = async (req,res,next) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;
    if(id){
        let exam = await Exam.findByIdAndRemove(id).catch( () => console.log("failed to get exam"));
        if(!exam) return res.sendStatus(404);
        
        res.status(200).send(exam)
    }else{
     return	res.status(400).json({error:'Missing Required fields'})
    }
};






 //Exportations of tge module
 module.exports = lib