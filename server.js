'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

app.get('/api/notes',(req, res) => {
  let newData = data;
  if (req.query.searchTerm) {
    newData = data.filter(item => (item.title.toLowerCase().includes(req.query.searchTerm.toLowerCase()) || item.content.toLowerCase().includes(req.query.searchTerm.toLowerCase())));
  }
  res.json(newData);
});

app.get('/api/notes/:id',(req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});