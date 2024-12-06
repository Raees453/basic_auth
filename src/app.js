const express = require('express');
const connectDB = require('./db');
const globalErrorHandler = require('./utils/global_error_handler');

const routes = require('./routes');

const app = express();

connectDB();

app.use(express.json());
app.use(routes);

app.use(globalErrorHandler);

module.exports = app;
