const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const winston = require('../winston');
const routes = require('./routes');

const app = express();
app.set('view engine', 'pug');

// log requests to the console
app.use(morgan('combined', { stream: winston.stream }));

// parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// attach routes
app.get('/', (req, res) => {
  res.set('content-type', 'text/plain');
  res.send('Hello from Express server!');
});

app.use('/api/v1', routes);

// serve swagger
app.use('/swagger.json', express.static('./swagger.json'));
app.use('/v1/swagger', express.static('./api-docs'));

// 404 handler
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.code = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
