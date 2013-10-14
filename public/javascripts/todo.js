jQuery(function($) {
  "use strict";

  var App = {
    init: function() {
      this.cacheElements();
      this.render();
      this.bindEvents();
    },
    cacheElements: function() {
      this.$newTodo = $('#new-todo');
      this.$todoList = $('#todo-list');
    },
    // Save the Todo
    store: function(data) {
      if(data) {
        $.post('/todos/add', data, function(data, textStatus, jqXHR) {
          App.appendTodo(data);
          this.$newTodo.val('');
        });
      }
    },
    // Bind all events
    bindEvents: function() {
      this.$newTodo.on('keyup', this.create);
      $('.toggle').live('click', function() {
        var line_header = $(this).parent().parent();
        var todo_id = line_header.attr('id');
        var status = line_header.hasClass('done') ? 'none' : 'done';
        App.changeTodoStatus(todo_id, status);
      });
      $('.destroy').live('click',function() {
        App.destroy($(this));
      })
    },
    create: function(e) {
      if (e.which !== 13) {
        return;
      }

      var todo_title = $(this).val();
      if (!todo_title) {
        return;
      }

      var todo = {
        title: todo_title,
        done: false
      }
      $(this).val('');
      App.store(todo);
    },

    // Include todo in DOM
    appendTodo: function(todo) {
      $('#todo-list').append(App.template(todo));
    },

    // Remove todo from DOM
    removeTodo: function(todoId) {
      $('li#' + todoId).remove();
    },
    // Get all todos from server and render it.
    render: function() {
      $.getJSON('/todos/', function(data) {
        var tam = data.length, i;
        for(i = 0; i < tam; i++) {
          $('#todo-list').append(App.template(data[i]));
        }
      });
    },

    // Remove or add the class for todo, done or not. and after that, change the todo status
    changeTodoStatus: function(id, status) {
      if(status === 'done') {
        this.$todoList.children('li#' + id).addClass('done');
      } else {
        this.$todoList.children('li#' + id).removeClass('done');
      }

      App.markTodo(id, status);
    },

    // Change the Todo Status to Done or not
    markTodo: function(todoId, status) {
      var data = {
        id: todoId,
        status: status
      }

      $.post('/todos/done', data, function(err, res) {
        if(err) throw err;
        if( status !== 'done') {
          $(this).attr('checked', false);
        }
      });
    },

    // Send todo id to server to destroy it
    destroy: function(e) {
      var todo = e.parent().parent().attr('id');
      $.post('/todos/destroy', {id: todo});
      App.removeTodo(todo);
    },

    // Template for each todo
    template: function(todo) {
      var template, status, checked;
      status = todo.done ? 'done' : '';
      checked = status == 'done' ? 'checked="checked"' : '';

      template  = '<li id="' + todo._id + '" class="' + status + '">';
      template += '<div class="view">';
      template += '<input type="checkbox" class="toggle" ' + checked + '/>';
      template += '<label>' + todo.title + '</label>';
      template += '<a class="destroy"></a>';
      template += '</div>';
      template += '</li>';

      return template;
    }
  };

  window.TodoApp = App.init();
});