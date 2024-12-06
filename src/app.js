const express = require('express');
require('dotenv').config();

const globalErrorHandler = require('./utils/global_error_handler');

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

app.use(globalErrorHandler);

module.exports = app;
