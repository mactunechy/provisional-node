/*
* User model
*/

//Dependencies
const mongoose = require ('mongoose');
const {hash} = require ('../../lib/helpers');
const config = require ('../../lib/config');
const jwt = require ('jsonwebtoken');
const {uploadOnline} = require ('../../lib/fileUploader');

//Users Schema
const userSchema = new mongoose.Schema ({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 15,
    required: true,
  },
  password: {
    type: String,
    maxlength: 1000,
  },
  isAdmin: {
    type: Boolean,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  clearance: {
    type: String,
    default: 'green',
  },
  accessToken: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Token',
  },
});

userSchema.methods.authUser = async function({email, password}) {
  let inputPassword = await hash (password);
  console.log (inputPassword);
  console.log (this.password);
  if (this.password !== inputPassword) return false;
  if (this.email !== email) return false;
  let token = await jwt.sign (
    {
      id: this._id,
      isAdmin: this.isAdmin,
      firstName: this.firstName,
      clearance: this.clearance,
      accessToken: this.accessToken,
    },
    config.hashingSecret,
    {expiresIn: '1h'}
  );
  return {token};
};

userSchema.methods.renewToken = async function () {
  let token = jwt.sign (
    {
      id: this._id,
      isAdmin: this.isAdmin,
      firstName: this.firstName,
      clearance: this.clearance,
      accessToken: this.accessToken,
    },
    config.hashingSecret,
    {expiresIn: '1h'}
  );
  return {token};
};

userSchema.methods.setProfileImage = async function (file) {
  return new Promise ((resolve, reject) => {
    let a = file.originalname.split ('.');
    let fileName = `${this.firstName}-${this.firstLastName}-profile.${a[a.length - 1]}`;
    uploadOnline ('profiles', fileName, file.buffer)
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

//User Model
const User = mongoose.model ('User', userSchema);

//Exporting the Model
module.exports = User;
