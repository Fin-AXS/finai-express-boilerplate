const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const compression = require('compression');

const v1Routes = require('./routes/v1');
const {errorConverter, errorHandler} = require('./middleware/error');
const expressLogger = require('./middleware/express-logger');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');

const app = express();
// set security http headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({extended: true}));
// plugin express-log4js request logger
app.use(expressLogger());
// sanitize request data
app.use(xss());
// gzip compression
app.use(compression());
// enable cors
app.use(cors());

app.use('/', v1Routes);

// Handle all other routes.
// send back 404 error for any non matching routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError if required
app.use(errorConverter);
// handle error
app.use(errorHandler);

module.exports = app;
