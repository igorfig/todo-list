function modalToggle() {
  document.querySelector('.modal-overlay').classList.toggle('active');
  clearField();
  removeErrorWarning();
}

function modalDeleteToggle() {
   modalToggle();

    const modal = document.querySelector('.modal')
    modal.classList.toggle('no-display')

    const modalDelete = document.querySelector('.modal-delete')
    modalDelete.classList.toggle('no-display')
}

function modalEditToggle() {
  document.querySelector('.modal-overlay').classList.toggle('active');
  document.querySelector('.modal-edit').classList.toggle('no-display')
  document.querySelector('.modal').classList.toggle('no-display')
  removeErrorWarning();
}


const Storage = {
  get: () => JSON.parse(localStorage.getItem('db_tasks')) || [],
  set: tasks => localStorage.setItem('db_tasks', JSON.stringify(tasks) || []) 
}

const tasksData = Storage.get();

function addTasks(task) {
  tasksData.push(task);
  App.reload()
}

function updateTask(index) {
  const tasks = tasksData;
  modalEditToggle();
  const title = document.querySelector('#task-title-edit')
  title.value = tasks[index].title;
  const form = document.querySelector('#edit-task-form');

  form.onsubmit = () => {
    tasks[index] = {
      title: title.value,
      status: tasks[index].status
    }
    App.reload()
  }
} 

function confirmTask(index) {
  const tasks = tasksData;
  let status;

  if(tasks[index].status === 'Concluída') {
    status = 'Pendente'
  } else if(tasks[index].status === 'Pendente') {
    status = 'Concluída'
  }

  tasks[index] = {
    title: tasks[index].title,
    status
  }

  App.reload()
}

function deleteTask(index) {
  modalDeleteToggle()
  const form = document.querySelector('.delete-task-form');

  form.onsubmit = () => {
    const tasks = tasksData;
    tasks.splice(index, 1);
    console.log(index)
    App.reload();
  }
  
}

function clearAllTasks() {
  modalDeleteToggle();
  const form = document.querySelector('.delete-task-form');
  form.addEventListener('submit', () => {
    tasksData.splice(0, tasksData.length);
    form.removeAttribute('onsubmit');
    App.reload();
  })
}

function listContentVerifier() {
  const task = document.querySelector(".task");
  const emptyMessage = document.querySelector('.empty-message')
  const clearAllTasksBTN = document.querySelector('.clear-all');
    if(task === null) {
      emptyMessage.classList.add('active')
      clearAllTasksBTN.classList.add("no-display")
    } else {
      emptyMessage.classList.remove('active')
      clearAllTasksBTN.classList.remove("no-display")
    }
}

function preventDefault(event) {
  event.preventDefault();
}

function statusChecker(task) {
  let status;
  let statusClass;
  let cssProperty;

  if(task.status === 'Concluída') {
    status = '[ ✔ ] - '
    statusClass = 'done';
    cssProperty = 'style="text-decoration: line-through; opacity: .6;"'
  } else if(task.status === 'Pendente') {
    status = '[ ] - '
    statusClass = 'pending';
  }

  return {
    status,
    statusClass,
    cssProperty
  }
}

function teste() {
  const taskTitleValue = document.querySelector('#task-title').value;
  if(taskTitleValue.trim().length > 22) {
      return taskTitleValue.substr(0, 22) + '...';
  }
}

function render(task, index) {
  const li = document.createElement('li');
  const { status, statusClass, cssProperty } = statusChecker(task);
  const title = task.title.trim().length > 22 ? task.title.substr(0, 22) + '...' : task.title
    li.classList.add('task')
    li.dataset.index = index


    li.innerHTML = `
      <img src="./assets/edit.png" class="edit" onclick="updateTask(${index})"/>
      <img src="./assets/delete.svg" onclick="deleteTask(${index})" class="remove">
      <a href="#" class="mark" onclick="confirmTask(${index}), preventDefault(event)">${status}</a>
      <span class="task-title" onclick="updateTask(${index})" ${cssProperty}>${title}</span>
      <span class="status ${statusClass}">( ${task.status})</span>
    `
    document.querySelector('.task-list').appendChild(li);
    listContentVerifier();
}

const clearTasks = () => document.querySelector('.task-list').innerHTML = '';

function validateForm() {
  const taskTitleValue = document.querySelector('#task-title').value;

    if(taskTitleValue.trim() === "") {
      throw new Error('Preencha o campo e tente novamente!');
    }
}

function removeErrorWarning() {
  const errorMessage = document.querySelector('.error-message');
  errorMessage.textContent = ''

  const inputTaskTitle = document.querySelector('#task-title')
  inputTaskTitle.classList.remove('error-warning')
}

const clearField = () => document.querySelector('#task-title').value = '';

function submitForm(event) {
  event.preventDefault();

  try {
    validateForm();
    const taskTitleValue = document.querySelector('#task-title').value;
    addTasks({
      title: taskTitleValue,
      status: 'Pendente'
    }) 
    modalToggle();
  } catch (error) {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = error.message

    const inputTaskTitle = document.querySelector('#task-title')
    inputTaskTitle.classList.add('error-warning')
  }
}

const App = {
  init() {
    listContentVerifier();
    tasksData.forEach(render);
    Storage.set(tasksData);
  },

  reload() {
    clearTasks();
    this.init();
  }
}

App.init();