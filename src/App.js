import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import NotFound from './components/NotFound';
import CrashTest from './components/CrashTest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5002/api/todo')
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((todo, idx) =>
          typeof todo === 'string'
            ? { id: idx + 1, title: todo, status: 'pending' }
            : {
                id: idx + 1,
                title: todo.title ?? String(todo),
                status: todo.status ?? (todo.completed ? 'completed' : 'pending')
              }
        ); 
        setTodos(normalized);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<TodoList todos={todos} setTodos={setTodos} />} />
            <Route path="/todos/:id" element={<TodoDetail todos={todos} setTodos={setTodos} />} />
            <Route path="/crash-test" element={<CrashTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
