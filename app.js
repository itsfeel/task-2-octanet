let tasks = [];

const loadTasks = () => {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();

  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = "";
    updateTasksList();
    saveTasks();
  } else {
    alert("Please enter a task!");
  }
};

document.getElementById("newTask").addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});

const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("taskItem");
    listItem.innerHTML = `
      <div class="task ${task.completed? 'completed' : ''}">
        <input type="checkbox" class="checkbox" ${task.completed? 'checked' : ''} />
        <p>${task.text}</p>
      </div>
      <div class="icons">
        <img src="pencil.png" alt="Edit Task" onclick="editTask(${index})" class="icon"/>
        <img src="delete.png" alt="Delete Task" onclick="deleteTask(${index})" class="icon"/>
      </div>
    `;

    listItem.querySelector(".checkbox").addEventListener("change", () => {
      toggleTaskComplete(index);
    });

    taskList.appendChild(listItem);
  });

  updateStats();

  // Add this condition to trigger the blaskConfetti function
  const completedTasks = tasks.filter(task => task.completed).length;
  if (tasks.length && completedTasks === tasks.length) {
    blaskConfetti();
  }
};

const toggleTaskComplete = (index) => {
  tasks[index].completed =!tasks[index].completed;
  updateTasksList();
  saveTasks();
};

const editTask = (index) => {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = tasks[index].text;
  const newTaskButton = document.getElementById("newTask");
  newTaskButton.innerText = "Update Task";
  newTaskButton.onclick = function() {
    const newText = taskInput.value.trim();
    if (newText) {
      tasks[index].text = newText;
      updateTasksList();
      saveTasks();
      newTaskButton.innerText = "Add Task";
      newTaskButton.onclick = addTask;
    } else {
      alert("Task cannot be empty!");
    }
  };
};

const deleteTask = (index) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    updateTasksList();
    saveTasks();
  }
};

const updateStats = () => {
  const totalTasks = tasks.length;
  const completeTasks = tasks.filter(task => task.completed).length;
  const progress = totalTasks === 0? 0 : (completeTasks / totalTasks) * 100;

  document.getElementById("progress").style.width = `${progress}%`;
  document.getElementById("progress-text").innerText = `${completeTasks}/${totalTasks}`;
};

document.getElementById("clearTasks").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    updateTasksList();
    saveTasks();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateTasksList();
});

const blaskConfetti = () => {
  const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}