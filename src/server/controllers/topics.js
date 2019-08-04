/**
 * * topics Controllers 
 */

//Dependencies
const Topic = require ('../models/Topic');
const validator = require ('../models/Topic/validator');

//container of the module
const lib = {};

lib.create = (req, res) => {
  const details = req.body;
  const valid = validator (details);
  console.log ('valid', valid);
  if (valid.error)
    return res.status (400).send ({error: 'Missing required fields'});
  Topic.create (details)
    .then (topics => {
      return res.status (200).send (topics);
    })
    .catch (error => {
      console.log ('error', error);
      return sendStatus (500);
    });
};

//Retreving a specific note
lib.get = async (req, res) => {
  //Required data
  let {id} = req.params;
  id = typeof id == 'string' && id.trim ().length > 0 ? id.trim () : false;

  if (!id) return res.status (400).json ({error: 'Missing Required fields'});

  let topics = await Topic.findById (id).catch (() =>
    console.log ('failed to get Topic')
  );

  if (!topics) return res.sendStatus (404);
  res.status (200).send (topics);
};

//Retreving a specific user
lib.getAll = async (req, res) => {
  //Required data
  let topics = await Topic.find ({})
    .populate ('notes')
    .populate ('questions')
    .exec ()
    .catch (() => console.log ('failed to get topics'));
  if (!topics) return res.sendStatus (404);

  res.status (200).send (topics);
};

//Updating  Topic
lib.update = async (req, res) => {
  const details = req.body;
  const {id} = req.params;
  if (!id) return res.status (400).send ({error: 'Missing required fields'});
  const valid = validator (details);
  if (valid.error)
    return res.status (400).send ({error: 'Invalid data format'});
  //save the new user date
  let topic = await Topic.findByIdAndUpdate (id, details, {new: true});
  if (!topic) return res.sendStatus (404);
  return res.status (200).send (topic);
};

//Delete a Topic
lib.delete = async (req, res, next) => {
  //Required data
  let {id} = req.params;
  id = typeof id == 'string' && id.trim ().length > 0 ? id.trim () : false;
  if (id) {
    let topic = await Topic.findByIdAndRemove (id).catch (() =>
      console.log ('failed to get Topic')
    );
    if (!topic) return res.sendStatus (404);

    res.status (200).send (topic);
  } else {
    return res.status (400).json ({error: 'Missing Required fields'});
  }
};

//Exportations of tge module
module.exports = lib;
