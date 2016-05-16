$(document).ready(function () {
  console.log('bbob');
  $('form').on('submit', addTask);
});

function addTask(e) {
  e.preventDefault();
  var $input = $(e.target).find('input');
  var text = $input.val();

  // debugger
  saveTask(text);

  $('#pending').append(taskHtml(text));
  $input.val('');
}

function saveTask(text) {
  var tasks = JSON.parse(localStorage.tasks || '{}');
  tasks[slugify(text)] = text;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // debugger
}

function taskHtml(text){
  return  '<div class="col-xs-6">' +
            '<div class="card card-block card-warning card-inverse">' +
              '<button class="close"><span>&times;</span></button>' +
              '<h3 class="card-title">' + text + '</h3> </div> ';
}

function slugify(text){
  return text.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-');
}
