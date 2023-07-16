const express = require('express').Router();

const feedbackRouter = require('./js/index');

const app = express();

app.use('/notes', feedbackRouter);

module.exports = app;