/*
* Exam Model
*/

//Dependencies
const mongoose = require ('mongoose');
//Users Schema
const schema = new mongoose.Schema ({
  student: {
    type: mongoose.SchemaTypes.ObjectId,
    ref : 'User',
    required : true
  },
  questions : [{
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Question'
  }],
  score :{
      type : Object
  }
});





schema.methods.getTotalScore = async function (score) {
    const totalScore = {
        total:score
    }
  if(score >= 23){
    totalScore.grade = 'pass'
  }else{
      totalScore.grade = 'fail'
  }
  this.score = totalScore
  return this.save()
};


//User Model
const Exam = mongoose.model ('Exam', schema);

//Exporting the Model
module.exports = Exam;
