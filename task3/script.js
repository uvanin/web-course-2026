'use strict';

let tasks = [];
let showActive = true;    
let showCompleted = true;  
let nextId = 1;

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const warning = document.getElementById('warning');
const counter = document.getElementById('counter');
const listEl = document.getElementById('task-list');
const filterActiveEl = document.getElementById('filter-active');
const filterCompletedEl = document.getElementById('filter-completed');

function render() {
  const visibleTasks = tasks.filter((task) => {
    if (task.completed) return showCompleted;
    return showActive;
  });

  listEl.innerHTML = '';

  const items = visibleTasks.map((task) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task__text';
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'task__delete';
    delBtn.textContent = 'Удалить';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, span, delBtn);
    return li;
  });

  items.forEach((li) => listEl.appendChild(li));

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;
  counter.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    showWarning();
    return;
  }
  hideWarning();

  tasks.push({
    id: nextId++,
    text: trimmed,
    completed: false,
  });

  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

function showWarning() {
  warning.hidden = false;
}

function hideWarning() {
  warning.hidden = true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

input.addEventListener('input', hideWarning);

filterActiveEl.addEventListener('change', () => {
  showActive = filterActiveEl.checked;
  render();
});

filterCompletedEl.addEventListener('change', () => {
  showCompleted = filterCompletedEl.checked;
  render();
});

render();