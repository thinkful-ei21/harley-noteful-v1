'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');

// ADD STATIC SERVER HERE
app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', notesRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});