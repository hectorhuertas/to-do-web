$(document).ready(function () {
  doneHeight();
  addListeners();
  tutorial();
  renderTasks();
});

var drake = dragula([ document.querySelector('#pending'),
  document.querySelector('#done')],
{
  accepts: function (el, target, source, sibling) { return target !== source; }
});
drake.on('drop', function (el,container) {
  // debugger
  // $(el).toggleClass('done')
  var tasks = load();

  var index = tasks.findIndex(function (elem) {
    return elem.id === el.id;
  });
  var current = tasks[index].status;
  tasks[index].status = current === 'done' ? 'pending' : 'done';
  save(tasks);
  // debugger
  console.log('janduriel');
});

drake.on('over', function (el,container) {
  container.id === 'done' ? bigSize(el) : smallSize(el);
});

function bigSize(el) { $(el).removeClass('col-xs-6').addClass('col-xs-12'); }
function smallSize(el) { $(el).removeClass('col-xs-12').addClass('col-xs-6'); }

function deleteTask(e) {
  var tasks = load();
  $task = $(e.target).closest('.task');

  var index = tasks.findIndex(function (el) {
    return el.id === $task.attr('id');
  });
  tasks.splice(index,1);
  save(tasks);

  $task.remove();
}

function renderTasks() {
  var tasks = load();
  var pending = '';
  var done = '';

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status === 'done') {
      done = done + taskHtml(tasks[i]);
    } else {
      pending = pending + taskHtml(tasks[i]);
    }
  }
  $('#pending').append(pending);
  $('#done').append(done);
}

function addTask(e) {
  e.preventDefault();
  var $input = $(e.target).find('input');
  var text = $input.val();
  var task = {
    id: slugify(text),
    text: text,
    status: 'pending',
    color: randomColor()
  };

  var tasks = load();
  tasks.push(task);
  save(tasks);

  $('#pending').append(taskHtml(task));
  $input.val('');
}

function taskHtml(task){
  var done = task.status === 'done';
  var size = (done ? '12' : '6');
  return  '<div id="' + task.id + '"class="task col-xs-' + size + '">' +
            '<div class="card card-block card-' + task.color + ' card-inverse">' +
              '<button class="close"><span>&times;</span></button>' +
              '<h3 class="card-title">' + task.text + '</h3>' +
            '</div>' +
          '</div>';
}

function randomColor() {
  var colors = ['success', 'primary', 'info', 'danger', 'warning'];
  var random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function slugify(text){
  return text.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-');
}

function tutorial() {
  if (!('tasks' in localStorage)) {
    var tasks = [
      {
        id: 'completing',
        text: 'Complete this task by dragging it to the "Done" panel.',
        status: 'pending',
        color: 'info'
      },
      {
        id: 'deleting',
        text: 'Delete this task by clicking the button in the top right.',
        status: 'done',
        color: 'success'
      }
    ];
    save(tasks);
  }
}

function load(){
  return JSON.parse(localStorage.tasks);
}

function save(tasks){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addListeners() {
  $('form').on('submit', addTask);
  $('.task-list').delegate('button.close', 'click', deleteTask);
  $('.task-list').delegate('.task', 'mouseenter', showCloseButton);
  $('.task-list').delegate('.task', 'mouseleave', hideCloseButton);
}

function hideCloseButton(e) { $(e.target).find('button').hide(); }
function showCloseButton(e) { $(e.target).find('button').show(); }

function doneHeight() {
  var height = window.innerHeight * 0.7;
  $('#done').css('min-height', height);
}
