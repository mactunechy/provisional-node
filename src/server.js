/*
* Root of the application
*/

//Dependencies
require ('express-async-errors');
const logger = require ('./server/startup/logging');
const errors = require ('./server/middleware/errors');
const requestLogger = require ('./server/middleware/logger');
const express = require ('express');
const mongoose = require ('mongoose');
const router = require ('./server/routes');
const config = require ('./server/lib/config');
const path = require ('path');
const productionConfig = require ('./server/startup/prod');

const cors = require ('cors');

const appBoostrap = () => {
  const app = express ();

  app.use (express.urlencoded ({extended: true}));

  //logging and handling uncaught errors
  logger ();

  mongoose
    .connect (config.mongoDB.uri, {useNewUrlParser: true})
    .then ((err, db) => {
      console.log ('connected to mongoDB');
    })
    .catch (e => {
      throw new Error (e);
    });

  //production settings
  if (config.envName == 'production') {
    productionConfig (app);
  } else {
    app.use (cors ({origin: 'http://localhost:3000'}));
  }

  //setting to JSON api
  app.use (express.json ());

  //Request logger
  app.use (requestLogger);

  //invoking the router
  router (app);

  //static files
  app.use (express.static (path.join (__dirname, 'public')));

  //Captchering all Async errors
  app.use (errors);

  //stating the app  @TODO move this to DB connection callback
  app.listen (config.port, () =>
    console.log (
      `app running in ${config.envName}, listening on port ${config.port}`
    )
  );

  console.log (`Worker ${process.pid} started`);
};

module.exports = appBoostrap;
