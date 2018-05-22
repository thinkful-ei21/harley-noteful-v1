'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
notes.filter('the', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1006, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1006, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const newObj = {
  title: 'New Note',
  content: 'Splendiferous'
};

notes.create(newObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
    notes.delete(item.id, (err, numItems) => {
      if (err) {
        console.error(err);
      }
      if (numItems) {
        console.log(numItems);
      } else {
        console.log('not found');
      }
    });
  } else {
    console.log('not found');
  }
});