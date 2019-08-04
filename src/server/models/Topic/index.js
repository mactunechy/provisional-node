/*
* Question Model
*/

//Dependencies
const mongoose = require ('mongoose');
//Users Schema
const schema = new mongoose.Schema ({
  label: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  property: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notes',
    },
  ],
});

const Topic = mongoose.model ('Topic', schema);

//Exporting the Model
module.exports = Topic;
