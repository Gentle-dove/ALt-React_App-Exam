const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const todosPath = './src/todo.json';

// Helper to read todos
function readTodos() {
  try {
    const data = fs.readFileSync(todosPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

// Helper to write todos
function writeTodos(todos) {
  fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2));
}

// GET all todos
app.get('/api/todo', (req, res) => {
  res.json(readTodos());
});

// POST a new todo
app.post('/api/todo', (req, res) => {
  const todos = readTodos();
  const newTodo = req.body;
  newTodo.id = Date.now(); // simple unique id
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// PUT (update) a todo
app.put('/api/todo/:id', (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id, 10);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).send('Todo not found');
  todos[idx] = { ...todos[idx], ...req.body, id };
  writeTodos(todos);
  res.json(todos[idx]);
});

// DELETE a todo
app.delete('/api/todo/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    writeTodos(todos);
    res.status(204).send(); // No content
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.listen(5002, () => console.log('Server running on port 5002'));