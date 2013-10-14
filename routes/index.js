var ToDo = require('../models/todo');

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index')
};

/*
 * ADD ToDo
 */

exports.add = function(req,res) {

  res.contentType('applicaton/json');

  if(req.body.title) {
    var todo = new ToDo({
      title: req.body.title,
      done: false
    });

    todo.save(function(err) {
      if(err) {
        throw err;
        res.send(err);
      }
      else {
        console.log("Todo Saved.")
        res.send(todo);
      }
    });
  }
};

/*
 * Return ToDo List
 */

exports.list = function(req,res) {
  ToDo.find({}, function(err, todos) {
    if(err) throw err;
    res.send(todos);
  });
};

/*
 * Change ToDo Status
 */

exports.done = function (req, res) {
  return ToDo.findById(req.body.id, function (err, todo) {
    todo.done = req.body.status == 'done' ? true : false;
    return todo.save(function (err) {
      if (!err) {
        console.log("TODO Updated.");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });
};

/**
 * Destroy ToDo by ID
 */

exports.destroy = function (req, res) {
  return ToDo.findById(req.body.id, function (err, todo) {
    if(!err) {
      return todo.remove(function (err) {
        if (!err) {
          console.log("TODO Removed.");
          return res.send('');
        } else {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      return res.send('ID not found.');
    }
  });
};