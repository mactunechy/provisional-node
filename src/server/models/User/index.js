/*
* User model
*/

//Dependencies
const mongoose = require ('mongoose');
const {hash} = require ('../../lib/helpers');
const config = require ('../../lib/config');
const jwt = require ('jsonwebtoken');
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
    default : false
  },
  clearance: {
    type: String,
    default: 'green',
  },
  accessToken : {
    type : mongoose.SchemaTypes.ObjectId,
    ref:'Token'
  }
});





userSchema.methods.authUser = async function ({ email, password }) {
  let inputPassword = await hash (password);
  console.log (inputPassword);
  console.log (this.password);
  if (this.password !== inputPassword) return false;
  if (this.email !== email) return false;
  let token = await jwt.sign (
    {
      id: this._id,
      group: this.group,
    isAdmin: this.isAdmin,
    firstName : this.firstName,
    clearance : this.clearance,
    accessToken : this.accessToken
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
    group: this.group,
    isAdmin: this.isAdmin,
    firstName : this.firstName,
    clearance : this.clearance,
    accessToken : this.accessToken
     },
    config.hashingSecret,
    {expiresIn: '1h'}
  );
  return {token};
};

//User Model
const User = mongoose.model ('User', userSchema);

//Exporting the Model
module.exports = User;
