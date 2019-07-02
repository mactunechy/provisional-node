/*
* Exam Model
*/

//Dependencies
const mongoose = require ('mongoose');
const { pricing } = require('../../lib/config')
//Users Schema
const schema = new mongoose.Schema ({
  pricing: {
    type: String,
    default :'free'
  },
  exams : [{
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Exam'
  }],
  expiresAt :{
      type : Date,
  }
});





schema.methods.verify =  function () {
    let response = {}
    if(this.pricing == 'enteprise'){
        response.isMaxExams = false
    }else{
        let { maxExams } = pricing[this.pricing]
        response.isMaxExams = this.exams.length >= maxExams ? true : false
    }
    if(this.pricing == 'free'){
        response.expired = false
    }else{
        response.expired = this.expiresAt < Date.now() ? true : false
    }
    
    return response
};

schema.methods.addExam = function(examId){
    let { exams } = this;
    exams.push(examId)
    this.exams = exams
    return this.save()
}


//User Model
const Token = mongoose.model ('Token', schema);

//Exporting the Model
module.exports = Token;
