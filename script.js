// DOM Elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clearBtn");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");

let todos = [];
let currentFilter = "all";

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  renderTodos();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      renderTodos();
    });
  });

  clearBtn.addEventListener("click", clearCompleted);
}

// Add a new todo
function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  todos.push(todo);
  todoInput.value = "";
  saveTodos();
  renderTodos();
  todoInput.focus();
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// Clear completed todos
function clearCompleted() {
  if (todos.some((t) => t.completed)) {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
      todos = todos.filter((todo) => !todo.completed);
      saveTodos();
      renderTodos();
    }
  } else {
    alert("No completed tasks to clear");
  }
}

// Render todos based on filter
function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((t) => t.completed);
  }

  if (filteredTodos.length === 0) {
    todoList.innerHTML =
      '<div class="empty-state"><p>No tasks yet. Add one to get started!</p></div>';
  } else {
    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? "checked" : ""}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;

      todoList.appendChild(li);
    });
  }

  updateStats();
}

// Update stats
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;

  totalCount.textContent = total;
  completedCount.textContent = completed;
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
  const saved = localStorage.getItem("todos");
  todos = saved ? JSON.parse(saved) : [];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
