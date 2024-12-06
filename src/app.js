const express = require('express');
const connectDB = require('./db');

const routes = require('./routes');

const app = express();

connectDB();

app.use(express.json());
app.use(routes);

module.exports = app;
