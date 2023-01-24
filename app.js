const DATA_URL = 'https://jsonplaceholder.typicode.com/todos';
// Define UI Variables
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const localTodos = document.querySelector('#local-todos')

const collection = document.querySelector('.collection');

// Load all event listeners
loadEventListeners();

// Load all event listeners function
function loadEventListeners() {
  // DOM Load event from local storage
  document.addEventListener('DOMContentLoaded', getTasks);
  // Add event task
  form.addEventListener('submit', addTask);
  // Remove task event on delete button
  taskList.addEventListener('click', removeTask);
  // Clear task event
  clearBtn.addEventListener('click', clearTasks);
  // Filter tasks event
  filter.addEventListener('keyup', filterTasks);
  // Display tasks event
  document.getElementById('local_todos').addEventListener('click', displayLocalTodos);
  // POST API tasks event
  document.getElementById('post-apis').addEventListener('click', postToDos);
  // Mark as completed
  taskList.addEventListener('click', markCompleted);
  // Add random todos 
  document.addEventListener('DOMContentLoaded', getRandomTodos);
  // Get todos 
  document.getElementById('number_limit').addEventListener('click', getRandomTodos)
  
}

// Get Tasks from local storage function
function getTasks() {
  let tasks;

  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  // Loop tro and check if tasks are there
  tasks.forEach(function (task) {
    // Create li element if task added
    const li = document.createElement('li');
    // Add class name to collection ul
    li.className = 'collection-item';
    // Create text node append to li
    li.appendChild(document.createTextNode(task));
    // Create new link element delete button
    const link = document.createElement('a');
    // Add class to link delete button
    link.className = 'delete-item secondary-content';
    // Add icon html
    link.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    // Append the link to li
    li.appendChild(link);

    // Append li to ul (.collection)
    taskList.appendChild(li);
  });
}

// AddTask Function
// function addTask(e) {
//   e.preventDefault()
//   if (taskInput.value === '') {
//     return null
//   }
//   // Create li element if task added
//   const li = document.createElement('li');
//   // Add class name to collection ul
//   li.className = 'collection-item';
//   // Create text node append to li
//   li.appendChild(document.createTextNode(taskInput.value));
//   // Create new link element delete button
//   const link = document.createElement('a');
//   // Add class to link delete button
//   link.className = 'delete-item secondary-content done';
//   // Add icon html
//   link.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
//   // Append the link to li
//   li.appendChild(link);

//   // Append li to ul (.collection)
//   taskList.appendChild(li);

//   // Store data in to local storage
//   storeTaskInLocalStorage(taskInput.value);

//   // Clear input
//   taskInput.value = '';
// }

function addTask(e) {
  e.preventDefault();
  if (taskInput.value === '') {
    // Display warning message
    document.querySelector('.label_msg').innerText = 'Please enter a task';
    document.querySelector('.label_msg').classList.add('warning');
    setTimeout(() => {
      document.querySelector('.label_msg').innerText =
        'Create your own task on local storage';
      document.querySelector('.label_msg').classList.remove('warning');
    }, 2000);
    return;
  }
  // Create li element if task added
  const li = document.createElement('li');
  // Add class name to collection ul
  li.className = 'collection-item';
  // Create text node append to li
  li.appendChild(document.createTextNode(taskInput.value));
  // Create new link element delete button
  const link = document.createElement('a');
  // Add class to link delete button
  link.className = 'delete-item secondary-content done';
  // Add icon html
  link.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  // Append the link to li
  li.appendChild(link);

  // Append li to ul (.collection)
  taskList.appendChild(li);

  // Store data in to local storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input
  taskInput.value = '';
}

// Store tasks to the local storage function
function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Display tasks from the local storage function
function displayLocalTodos() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  let output = '';
  tasks.forEach((task) => {
    output += `<li class="collection-item">${task}
    <a href="#" class="delete-item secondary-content">
    <i class="fa-solid fa-trash-can"></i>
    </a>
    </li>`;
  });
  taskList.innerHTML = output;
}


// Remove task function
function removeTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    e.target.parentElement.parentElement.remove();

    // Remove from the local storage
    removeTaskFromLocalStorage(e.target.parentElement.parentElement);
  }
}

// Remove items from the local storage function
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function (task, index) {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear tasks function
function clearTasks() {
  // first way
  // taskList.innerHTML = ''

  // Faster way
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Clear from the local storage
  clearTasksFromLocalStorage();
}

// Clear from the local storage function
function clearTasksFromLocalStorage() {
  localStorage.clear();
}

// Filter tasks function
function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach(function (task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

// Error function
function handleErrors(res) {
  if (!res.ok) throw new Error(res.error);
  return res;
}

// GET APIs
function getToDos(numCalls) {
  if (numCalls <= 0) {
    console.log('Please enter a valid number');
    return;
  }
  // fetch(`${DATA_URL}?_limit=${numCalls}`)
  fetch(`${DATA_URL}?_limit=${numCalls}`)
    .then((res) => res.json())
    .then((data) => {
      let output = '';
      data.forEach((toDo) => {
        output += `
        <li class="collection-item ${
          toDo.completed ? 'completed' : ''
        }" id="to_do"> ${toDo.title}
        <a class="delete-item secondary-content done"><i class="fa-solid fa-trash-can"></i></a>
        </li>
        `;
      });
      document.getElementById('collection').innerHTML = output;
    })
    .catch((err) => console.log(err));
}

document.getElementById('number_limit').addEventListener('click', (e) => {
  e.preventDefault();
  const numCalls = document.getElementById('number_input').value;
  getToDos(numCalls);
});

// Post APIs
function postToDos(e) {
  e.preventDefault();
  // Prepare the data to be sent to the API
  const todo = { title: postInput.value };
  // Use the Fetch API to send a POST request to the API
  fetch(DATA_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Create a new li element using template literals
      const li = `<li class="collection-item">${postInput.value}
            <a href="#" class="delete-item secondary-content">
            <i class="fa-solid fa-trash-can"></i>
            </a>
            </li>`;
            console.log(data);
      // Append the new li element to the taskList
      taskList.innerHTML += li;
      // Clear input
      postInput.value = '';
    })
    .catch((error) => console.log(error));
}

// Mark as completed on klick
function markCompleted(e) {
  if (e.target.classList.contains('collection-item')) {
    e.target.classList.toggle('completed');
  }
}

// ToDos not completed

// function getRandomTodos() {
//   fetch(DATA_URL)
//     .then((response) => response.json())
//     .then((data) => {
//       let output = '';
//       let randomTodos = shuffleArray(data).slice(0, 7);
//       randomTodos.forEach((todo) => {
//         output += `<li class="collection-item">${todo.title}<a class="delete-item secondary-content"><i class="fa-solid fa-trash-can"></i></a>`;
//       });
//       const container = document.querySelector('#collection');
//       if (container) {
//         container.innerHTML = output;
//       } else {
//         console.error('Container element with id "collection" not found');
//       }
//     })
//     .catch((error) => console.log(error));
// }

// Random ToDos
function getRandomTodos() {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      let output = '';
      let randomTodos = shuffleArray(data).slice(0, 7);
      randomTodos.forEach((todo) => {
        let className = '';
        if (todo.completed) className = 'completed';
        output += `<li class="collection-item ${className}">${todo.title}<a class="delete-item secondary-content"><i class="fa-solid fa-trash-can"></i></a>`;
      });
      const container = document.querySelector('#collection');
      if (container) {
        container.innerHTML = output;
      } else {
        console.error('Container element with id "collection" not found');
      }
    })
    .catch((error) => console.log(error));
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;

}


// Modal listener
taskInput.addEventListener('input', function (e) {
  e.preventDefault;
  let regex = /[a-zA-Z0-9]/;
  if (!regex.test(e.target.value)) {
    e.preventDefault();
    Swal.fire({
      title: 'Error',
      text: 'Only letters or numbers are allowed.',
      icon: 'error',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.value) {
        // Reset the value of all inputs
        taskInput.value = '';
        postInput.value = '';
      }
    });
  }
});

const postInput = document.querySelector('#post-input');
postInput.addEventListener('input', function (e) {
  e.preventDefault();
  let regex = /[a-zA-Z0-9]/;
  if (!regex.test(e.target.value)) {
    e.preventDefault();
    Swal.fire({
      title: 'Error',
      text: 'Only letters or numbers are allowed.',
      icon: 'error',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.value) {
        // Reset the value of all inputs
        taskInput.value = '';
        postInput.value = '';
      }
    });
  }
});
