/*
* Question Model
*/

//Dependencies
const mongoose = require ('mongoose');
//Users Schema
const schema = new mongoose.Schema ({
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  diagram: {
    type: String,
    minlength: 1,
  },
  correctAnswer: {
    type: Object,
    required: true,
  },
  multipleChoice: {
    type: Array,
    required: true,
  },
});

schema.methods.setDiagram = async function (file) {
  return new Promise ((resolve, reject) => {
    let a = file.originalname.split ('.');
    let fileName = `${this._id}-diagram.${a[a.length - 1]}`;
    uploadOnline ('questions', fileName, file.buffer)
      .then (location => {
        this.profileImage = location;
        this.save ();
        return resolve ();
      })
      .catch (err => {
        console.log (err);
        return reject ();
      });
  });
};

schema.methods.mark = async function (answer) {
  const isCorrect = this.correctAnswer.letter === answer;
  if (isCorrect) return {correct: true};
  return {correct: false, correctAnswer: this.correctAnswer};
};

//User Model
const Question = mongoose.model ('Question', schema);

//Exporting the Model
module.exports = Question;
