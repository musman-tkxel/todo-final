var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose');

var ToDo = require('./models/todo');
var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({src: __dirname + '/public'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost/node_todos');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/node_todos');
});

app.configure('test', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/test');
});

// Routes

app.get('/', routes.index);

app.post('/todos/add', function(req,res) {

  res.contentType('applicaton/json');

  if(req.body.title) {
    var todo = new ToDo({
        title: req.body.title,
        done: false
    });

    todo.save(function(err) {
      if(err) throw err;
      console.log("Todo Saved.")
      res.send(todo);
    });
  }
});

app.get('/todos/',function(req,res) {
  ToDo.find({}, function(err, todos) {
      if(err) throw err;
      res.send(todos);
  });
});

app.post('/todos/done', function (req, res) {
  return ToDo.findById(req.body.id, function (err, todo) {
    todo.done = req.body.status == 'done' ? true : false;
    return todo.save(function (err) {
      if (!err) {
        console.log("TODO Updated.");
      } else {
        console.log(err);
      }
    });
  });
});

/**
 * Remove one Todo by ID
 */
app.post('/todos/destroy', function (req, res) {
  return ToDo.findById(req.body.id, function (err, todo) {
    if(!err) {
      return todo.remove(function (err) {
        if (!err) {
          console.log("TODO Removed.");
          return res.send('');
        } else {
          console.log(err);
        }
      });
    } else {
      return res.send('ID not found.');
    }
  });
});

app.listen(3000, function() {
  console.log("Server Listening Port: %d", app.address().port);
});