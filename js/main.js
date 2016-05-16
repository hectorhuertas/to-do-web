$(document).ready(function () {
  $('form').on('submit', addTask);
  $('#pending').delegate('button.close', 'click', deleteTask);

  loadTasks();
});

var drake = dragula([document.querySelector('#pending'), document.querySelector('#completed')])
drake.on('drop', function (a,b,c) {
  // debugger
  $(a).removeClass('col-xs-6')
  $(a).addClass('col-xs-12')
  console.log('janduriel');
})

function deleteTask(e) {
  var tasks = JSON.parse(localStorage.tasks || '{}');
  var id = $(e.target).closest('.task').attr('id')
  delete tasks[id]
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log('delete');
  $(e.target).closest('.task').remove();
}

function loadTasks() {
  var tasks = JSON.parse(localStorage.tasks || '{}');
  html = '';
  for (var task in tasks) {
    // debugger
    html = html + taskHtml(tasks[task]);
  }
  $('#pending').append(html);
}

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
  return  '<div id="' + slugify(text) + '"class="task col-xs-6" draggable="true">' +
            '<div class="card card-block card-warning card-inverse">' +
              '<button class="close"><span>&times;</span></button>' +
              '<h3 class="card-title">' + text + '</h3>' +
            '</div>' +
          '</div>';
}

function slugify(text){
  return text.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-');
}
