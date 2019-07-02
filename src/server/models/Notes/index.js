/*
* Notes Model
*/

//Dependencies
const mongoose = require ('mongoose');

//Notes Schema
const schema = new mongoose.Schema ({
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  diagram: {
    type: String,
    minlength: 1,
  },
  example: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Question'
  }
});






//Notes Model
const Notes = mongoose.model ('Notes', schema);

//Exporting the Model
module.exports = Notes;
