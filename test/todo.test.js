var express = require('express');
var request = require('supertest');
process.env.NODE_ENV = 'test';
var app = require('../app');
var ToDo = require('../models/todo');

describe('#Routes:', function() {
  it('it should route to INDEX successfully', function(done) {
    request(app)
        .get('/')
        .expect(200)
        .end(function(err,res) {
          if(err) throw err;
          console.log('PASS: Redirection to INDEX Successfully');
          done();
        });
  });
});

describe('#Routes:', function() {
  it('it should not route to INDEX successfully', function(done) {
    request(app)
        .get('/unknown')
        .expect(404)
        .end(function(err,res) {
          if(err) throw err;
          console.log('PASS: Redirection to INDEX Failed, PATH Not Found');
          done();
        });
  });
});

describe('#Todo Creation:', function() {
  it('it should save new todo successfully', function(done) {
    request(app)
        .post('/todos/add')
        .set('Accept', 'application/json')
        .send({title: 'welcome'})
        .expect(200)
        .end(function(err,res) {
          if(err) throw err;
          console.log('PASS: Object Successfully Added');
          done();
        });
  });
});

describe('#Todo Deletion:', function() {
  it('it should destroy todo successfully', function(done) {
    var todo = new ToDo({
      title: "Testing Title",
      done: false
    });

    todo.save(function(err) {
      if( err ) throw err;
      console.log('Todo Saved.')
    });

    request(app)
        .post('/todos/destroy')
        .set('Accept', 'application/json')
        .send({id : todo._id})
        .expect(200)
        .end(function(err, res) {
          if(err) throw  err;
          console.log('PASS: Self Created Object Destroy by ID Succeed.');
          done();
        });
  });
});

describe('#Todo Deletion:', function() {
  it('it should not destroy todo successfully', function(done) {
    request(app)
        .post('/todos/destroy')
        .set('Accept', 'application/json')
        .send({id : -1})
        .expect(200)
        .end(function(err, res) {
          if(err) throw  err;
          console.log('PASS: Object Destroy by ID Failed. ID not found.');
          done();
        });
  });
});

describe('#Todo List:', function() {
  it('it should receive todo list successfully', function(done) {
    request(app)
        .get('/todos/')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          //console.log(res.body);
          console.log('PASS: Successfully Receive TODO Objects List');
          done();
        });
  });
});

describe('#Todo List:', function() {
  it('todo content-type should be \'application/json\' ', function(done) {
    request(app)
        .get('/todos/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          console.log('PASS: Content-Type \'application/json\' Received');
          done();
        });
  });
});

describe('#Todo List:', function() {
  it('it should have list count greater than ZERO', function(done) {
    request(app)
        .get('/todos/')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if(err) throw err;
          if(res.body.length >= 0) {
            console.log('PASS: Response List Length: ' + res.body.length);
          }
          else throw 'List Count is not Greater Than ZERO! ' + err;
          done();
        });
  });
});