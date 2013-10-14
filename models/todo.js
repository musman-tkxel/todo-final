mongoose = require('mongoose');

ToDoSchema = new mongoose.Schema({
    title: String,
    done: Boolean
  }
);

mongoose.model('ToDo', ToDoSchema);
ToDo = mongoose.model('ToDo');

module.exports = ToDo;