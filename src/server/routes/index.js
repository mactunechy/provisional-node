/*
* Root router
*/

//Dependencies
const users = require ('./users');
const ping = require ('./ping');
const logger = require ('../middleware/logger');
const questions = require ('./questions');
const notes = require ('./notes');
const exams = require ('./exams');
const tokens = require ('./tokens');
const topics = require ('./topics');

//root router function
const rootRouter = function (app) {
  app.use ('/api', logger, users);
  app.use ('/api', logger, questions);
  app.use ('/api', logger, notes);
  app.use ('/api', logger, exams);
  app.use ('/api', logger, tokens);
  app.use ('/api', logger, topics);
  app.use ('/api', ping);
};

module.exports = rootRouter;
