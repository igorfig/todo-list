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

const Storage = {
  get: () => JSON.parse(localStorage.getItem('db_tasks')) || [],
  set: tasks => localStorage.setItem('db_tasks', JSON.stringify(tasks) || []) 
}

const tasksData = Storage.get();

function addTasks(task) {
  tasksData.push(task);
  App.reload()
}

function updateTask(task, index) {
  const tasks = tasksData;
  tasks[index] = task
  App.reload()
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

function undo(index) {
  const tasks = tasksData;
  tasks[index] = {
    title: tasks[index].title,
    status:'Pendente'
  }

  App.reload()
}

function deleteTask(index) {
  const tasks = tasksData;
  tasks.splice(index, 1);
  App.reload();
}

function listContentVerifier() {
  const task = document.querySelector(".task");
    if(task === null) {
      const emptyMessage = document.querySelector('.empty-message')
      emptyMessage.classList.add('active')
    }
}


function statusChecker(task) {
  let status;
  let statusClass;
  let cssProperty;

  if(task.status === 'Concluída') {
    status = '[ ✔ ] - '
    statusClass = 'done';
    cssProperty = 'style="text-decoration: line-through;"'
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

function render(task, index) {
  const li = document.createElement('li');
    const { status, statusClass, cssProperty } = statusChecker(task);
    li.classList.add('task')
    li.dataset.index = index
    li.innerHTML = `
    <a href="#" class="mark" onclick="confirmTask(${index})">${status}</a>
    <span class="task-title" ${cssProperty}>${task.title}</span>
    <span class="status ${statusClass}">( ${task.status})</span>
    <img src="./assets/excluir.png" onclick="deleteModalForm(${index})" class="remove">
    ` 

    document.querySelector('.task-list').appendChild(li);
    const emptyMessage = document.querySelector('.empty-message')
    emptyMessage.classList.remove('active')
}

const clearTasks = () => document.querySelector('.task-list').innerHTML = '';

function validateForm() {
  const taskTitleValue = document.querySelector('#task-title').value;

    if(taskTitleValue.trim() === "") {
      throw new Error('Preencha o campo e tente novamente!');
    }
}

const clearField = () => document.querySelector('#task-title').value = '';

function removeErrorWarning() {
  const errorMessage = document.querySelector('.error-message');
  errorMessage.textContent = ''

  const inputTaskTitle = document.querySelector('#task-title')
  inputTaskTitle.classList.remove('error-warning')
}

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

function deleteModalForm(index) {
  modalDeleteToggle();

  const formSubmit = document.querySelector('.confirm');

  formSubmit.addEventListener('click', () => {
    deleteTask(index)
  })
}

const cancelDelete = () => modalDeleteToggle();

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