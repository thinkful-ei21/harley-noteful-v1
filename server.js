'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();

const { PORT } = require('./config');

const { requestLogger } = require('./middleware/logger');

// ADD STATIC SERVER HERE
app.use(requestLogger);

app.use(express.static('public'));

app.get('/api/notes',(req, res) => {
  let newData = data;
  if (req.query.searchTerm) {
    let search = req.query.searchTerm.toLowerCase();
    newData = data.filter(item => (item.title.toLowerCase().includes(search) || item.content.toLowerCase().includes(search)));
  }
  res.json(newData);
});

app.get('/api/notes/:id',(req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

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