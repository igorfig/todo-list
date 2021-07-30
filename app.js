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

function doneTask(index) {
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

function doneAllTasks() {
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
  const emptyMessage = document.querySelector('.empty-message');
  const clearAllTasksBTN = document.querySelector('.clear-all');
  const doneAllTasksBTN = document.querySelector('.done-all');

    if(task === null) {
      emptyMessage.classList.add('active')
      clearAllTasksBTN.classList.add("no-display")
      doneAllTasksBTN.classList.add('no-display')
    } else {
      emptyMessage.classList.remove('active')
      clearAllTasksBTN.classList.remove("no-display")
      doneAllTasksBTN.classList.remove('no-display')
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
    status = 'done'
    statusClass = 'done';
    cssProperty = 'text-decoration: line-through; opacity: .6;'
    opacityLevel = 'opacity: .6;'
  } else if(task.status === 'Pendente') {
    status = 'pending'
    statusClass = 'pending';
  }

  return {
    status,
    statusClass,
    cssProperty,
    opacityLevel
  }
}

const createElement = (elementName, attributes = undefined) => {
  const element = document.createElement(elementName);

  if(attributes !== undefined) {
    const attributesAsArray = attributes !== undefined ? Object.entries(attributes) : undefined;
    attributesAsArray.forEach(([key, value]) => element.setAttribute(key, value));
  } 
  return element
}

function render(task, index) {
  const { cssProperty, status, statusClass } = statusChecker(task);
  const li = createElement('li', {
    class: 'task'
  })

  const title = task.title.trim().length > 30 ? task.title.substr(0, 30) + '...' : task.title

  const checkboxContainer = createElement('div', {
    class: 'checkbox-container',   
  })

  const checkbox = createElement('div', {
    class: `checkbox ${status}`,
  })

  checkbox.addEventListener('click', () => {
    doneTask(index);
  })

  const span = createElement('span', {
    class: 'task-title',
    style: cssProperty,
    onclick: `updateTask(${index})`
  })

  span.innerHTML = title

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(span);

  li.appendChild(checkboxContainer);
  
  const img_Delete = createElement('img', {
    src: './assets/delete.svg',
    onclick: `deleteTask(${index})`,
    class: "remove"
  })

  li.appendChild(img_Delete)
 
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