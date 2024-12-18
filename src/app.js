const express = require('express');
require('dotenv').config();

const globalErrorHandler = require('./utils/global_error_handler');

const routes = require('./routes');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(routes);

app.use(globalErrorHandler);

app.get('/', (req, res, next) => {
  console.log('Get command received');

  next();
});

module.exports = app;
