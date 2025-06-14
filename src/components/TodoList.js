import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { todoListPropTypes } from './propTypes';
import './TodoList.css'; 


function TodoList({ todos, setTodos }) {
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const TODOS_PER_PAGE = 10;

  const saveTodos = (newTodos) => {
    fetch('http://localhost:5002/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodos),
    });
  };

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    const newTodo = {
      id: todos.length + 1,
      title: input,
      status: 'pending'
    };
    const newTodos = [...todos, newTodo];
    saveTodos(newTodos);
    setInput('');
    setEditIndex(null);
    setEditValue('');
    setSearch('');
    setSearchTerm('');
    window.location.reload();
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    saveTodos(newTodos);
    window.location.reload();
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setEditValue(todos[index].title);
  };

  const handleSaveEdit = (index) => {
    if (editValue.trim() === '') return;
    const updatedTodos = [...todos];
    updatedTodos[index].title = editValue;
    saveTodos(updatedTodos);
    setEditIndex(null);
    setEditValue('');
    window.location.reload();
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || todo.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredTodos.length / TODOS_PER_PAGE);
  const startIdx = (currentPage - 1) * TODOS_PER_PAGE;
  const currentTodos = filteredTodos.slice(startIdx, startIdx + TODOS_PER_PAGE);

  const handleSearch = () => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  return (
    <div id="container">
      <h1 id='logo'>TO-DO LIST</h1>
      <div className='search-container'>
        <input
          id="search-input"
          type="text"
          placeholder="Search todos"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button id='search-btn' onClick={handleSearch} style={{ marginLeft: 8 }}>
          <FaSearch style={{ verticalAlign: 'middle', marginRight: 4 }} />
          </button>
      </div>
      <div className='filter-container' style={{ marginBottom: 16 }}>
        <label id='filter-lable' htmlFor="status-filter" style={{  }}>Filter:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Enter your task"
          id="input-todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTodo(); }}
        />
        <button className="add-btn" onClick={handleAddTodo}>
          <IoMdAdd style={{ verticalAlign: 'middle', marginRight: 4 }}/>
          ADD
          </button>
      </div>
      <div className='todo-container'>
        {filteredTodos.length === 0 && (
        <p className="empty-message">No Task yet. Add one!</p>
      )}
      <ul id="todo-list">
        {currentTodos.map((todo, index) => (
          <>
          <li
  key={todo.id}
  className={`todo-item${editIndex === index ? ' editing' : ''}`}
>
            <div className="todo-main-row">
              <button
                type="button"
                className={`todo-status ${todo.status}`}
                style={{
                  marginRight: 10,
                  color: todo.status === 'completed' ? 'green' : 'red',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit'
                }}
                title="Click to toggle status"
                aria-pressed={todo.status === 'completed'}
                tabIndex={0}
                onClick={() => {
                  const globalIdx = startIdx + index;
                  const updatedTodos = [...todos];
                  updatedTodos[globalIdx].status = updatedTodos[globalIdx].status === 'completed' ? 'pending' : 'completed';
                  setTodos(updatedTodos);
                  saveTodos(updatedTodos);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const globalIdx = startIdx + index;
                    const updatedTodos = [...todos];
                    updatedTodos[globalIdx].status = updatedTodos[globalIdx].status === 'completed' ? 'pending' : 'completed';
                    setTodos(updatedTodos);
                    saveTodos(updatedTodos);
                  }
                }}
                aria-label={`Mark as ${todo.status === 'completed' ? 'pending' : 'completed'}`}
              >
                {todo.status}
              </button>
              {editIndex === index ? (
                <input
                  className="todo-edit-input"
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(index); }}
                />
              ) : (
                <Link className="todo-title-link" to={`/todos/${String((startIdx + index + 1)).padStart(2, '0')}`}>{todo.title}</Link>
              )}
            </div>
          </li>
          <div className="buttons-outside">
            {editIndex === index ? (
              <button className="save-btn" onClick={() => handleSaveEdit(index)} title="Save">
                <IoSaveOutline style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Save
              </button>
            ) : (
              <button className="edit-btn" onClick={() => handleEditTodo(index)} title="Edit">
                <FaRegEdit style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Edit
              </button>
            )}
            <button className="delete-btn" onClick={() => handleDeleteTodo(startIdx + index)} title="Delete">
              <MdOutlineDelete style={{ verticalAlign: 'middle', marginRight: 4 }} />
              
            </button>
          </div>
          </>
        ))}
      </ul>
      </div>
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
            aria-current={currentPage === i + 1 ? "page" : undefined}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <footer className="footer-royal">
  &copy; {new Date().getFullYear()} ROYAL's Todo React App
</footer>
    </div>
  );
}

TodoList.propTypes = todoListPropTypes;

export default TodoList;