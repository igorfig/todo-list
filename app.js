function modalOverlayToggle() {
  document.querySelector('.modal-overlay').classList.toggle('active');
  clearField();
  removeErrorWarning();
}

function addNewTaskModal() {
  modalOverlayToggle();
  const modal = document.querySelector('.modal');
  modal.classList.toggle('no-display');
}

function editFormModal() {
  document.querySelector('.modal-overlay').classList.toggle('active');
  const modal = document.querySelector('.modal-edit');
  modal.classList.toggle('no-display');
}

function confirmDeleteForm() {
  modalOverlayToggle();
  const modal = document.querySelector('.modal-delete');
  modal.classList.toggle('no-display');
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
  editFormModal();
  const title = document.querySelector('#task-title-edit')
  title.value = tasks[index].title;
  title.select()
  const form = document.querySelector('#edit-task-form');

  form.onsubmit = () => {
    tasks[index] = {
      title: title.value,
      status: tasks[index].status
    }
    editFormModal();
    removeErrorWarning();
    App.reload()
  }
} 


function deleteTask(index) {
  confirmDeleteForm()
  const form = document.querySelector('.delete-task-form');

  form.onsubmit = () => {
    const tasks = tasksData;
    tasks.splice(index, 1);
    App.reload();
  }
}

function clearAllTasks() {
  confirmDeleteForm();
  const form = document.querySelector('.delete-task-form');
  form.addEventListener('submit', () => {
    tasksData.splice(0, tasksData.length);
    form.removeAttribute('onsubmit');
    App.reload();
  })
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

function confirmAllTasks() {
  const tasks = tasksData;
  
  const pendingTasks = tasks.filter(task => task.status === 'Pendente')
  const completedTasks = tasks.filter(task => task.status === 'Concluída')
  pendingTasks.forEach(task => {
    task.status = 'Concluída'
    App.reload()
  })

  completedTasks.forEach(task => {
    if(pendingTasks.length === 0) {
      task.status = 'Pendente';
      App.reload()
    }
  })

}

function listContentVerifier() {
  const task = document.querySelector(".task");
  const emptyMessage = document.querySelector('.empty-message')
  const clearAllTasksBTN = document.querySelector('.clear-all');
  const checkAllTasksBTN = document.querySelector('.check-all')

    if(task === null) {
      emptyMessage.classList.add('active')
      clearAllTasksBTN.classList.add("no-display")
      checkAllTasksBTN.classList.add('no-display')
    } else {
      emptyMessage.classList.remove('active')
      clearAllTasksBTN.classList.remove("no-display")
      checkAllTasksBTN.classList.remove('no-display')
    }
}

function preventDefault(event) {
  event.preventDefault();
}

function statusChecker(task) {
  let status;
  let statusClass;
  let cssProperty;

  let opacityLevel;

  if(task.status === 'Concluída') {
    status = '[✔]'
    statusClass = 'done';
    cssProperty = 'style="text-decoration: line-through; opacity: .6;"'
    opacityLevel = 'opacity: .6;'
  } else if(task.status === 'Pendente') {
    status = '[ ] '
    statusClass = 'pending';
  }

  return {
    status,
    statusClass,
    cssProperty,
    opacityLevel
  }
}


function menuTransition(index) {
  document.querySelectorAll('.menu')[index].classList.toggle("no-display");
  document.querySelectorAll('.close')[index].classList.toggle("no-display");
  document.querySelectorAll('.remove')[index].classList.toggle('no-display')
}

function render(task, index) {
  const li = document.createElement('li');
  const { status, statusClass, cssProperty, opacityLevel } = statusChecker(task);
  const title = task.title.trim().length > 20 ? task.title.substr(0, 22) + '...' : task.title
    li.classList.add('task')
    li.dataset.index = index

    li.innerHTML = `
    <div>
      <a href="#" class="mark ${statusClass}" onclick="confirmTask(${index}), preventDefault(event)">${status}</a>
      <span style="margin-left:5px; ${opacityLevel}">-</span>
      <span class="task-title" onclick="updateTask(${index})" ${cssProperty}> ${title}</span>
    </div>
    <div class="icons-container">
      <img src="./assets/delete.svg" onclick="deleteTask(${index})" class="remove no-display">
      <img src="./assets/menu.svg" onclick="menuTransition(${index})" class="menu">
      <img src="./assets/close.svg" onclick="menuTransition(${index})" class="close no-display">
    </div>
    `

    document.querySelector('.task-list').appendChild(li);
    listContentVerifier();

    const dragArea = document.querySelector('.task-list');
    new Sortable(dragArea, {
      animation: 350,
    })
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
    addNewTaskModal();
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