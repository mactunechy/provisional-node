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
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  diagram: {
    type: String,
    minlength: 1,
  },
  example: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Question',
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

//Notes Model
const Notes = mongoose.model ('Notes', schema);

//Exporting the Model
module.exports = Notes;
