var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose');

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
app.post('/todos/add', routes.add);
app.get('/todos/', routes.list);
app.post('/todos/done', routes.done);
app.post('/todos/destroy', routes.destroy);


app.listen(3000, function() {
  console.log("Server Listening Port: %d", app.address().port);
});