'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
  
});
  
describe('404 handler', function () {
  
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});

describe('API tests', function () {

  it('GET request "/api/notes" should return all notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.length).to.equal(10);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys('id', 'title', 'content');
        });
      });
  });

  it('GET request "/api/notes" with a query should return all notes containing query', function () {
    const validTerm = 'cat';
    
    return chai.request(app)
      .get('/api/notes')
      .query({searchTerm : validTerm})
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys('id', 'title', 'content');
          expect(item.title).to.contain(validTerm);
        });
      });
  });

  it('GET request "/api/notes" with a bad query should return an empty array', function () {
    const invalidTerm = 'aaaaaaaaaaaa';
    
    return chai.request(app)
      .get('/api/notes')
      .query({searchTerm : invalidTerm})
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.length).to.equal(0);
      });
  });

  it('POST request "/api/notes" should add item with provided data', function () {
    const newItem = { title: 'new item', content: 'new item'};
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
        expect(res).to.have.header('location');
      });
    
  });

  it('POST request "/api/notes" should return error if title field missing', function () {
    const newItem = { title: null, content: 'new item'};
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
    
  });

});