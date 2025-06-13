import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { todoDetailPropTypes } from './propTypes';
import './TodoDetail.css'; 


function TodoDetail({ todos, setTodos }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const todoIndex = parseInt(id, 10) - 1;
  const todo = todos[todoIndex];

  if (!todo)
    return (
      <div className="todo-detail-container">
        <h2>Todo not found.</h2>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );

  const handleToggleStatus = () => {
    const updatedTodos = [...todos];
    updatedTodos[todoIndex].status =
      updatedTodos[todoIndex].status === "completed" ? "pending" : "completed";
    setTodos(updatedTodos);
    fetch("http://localhost:5002/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodos),
    });
  };

  return (
    <div className="todo-detail-container">
      <h2>Todo Detail</h2>
      <p>
        <strong>ID:</strong> {String(todoIndex + 1).padStart(2, "0")}
      </p>
      <div className="todo-detail-title">
        <strong>Title:</strong> {todo.title}
      </div>
      <p>
        <strong>Status:</strong>
        <span
          className={"status " + todo.status}
          style={{
            color: todo.status === "completed" ? "green" : "red",
            marginLeft: 8,
          }}
        >
          {todo.status}
        </span>
      </p>
      <button
        className={`todo-detail-btn ${todo.status === "completed" ? "mark-pending" : "mark-completed"}`}
        id="todo-detail-mark-btn"
        onClick={handleToggleStatus}
        style={{ marginRight: 8 }}
      >
        Mark as {todo.status === "completed" ? "Pending" : "Completed"}
      </button>
      <button
        className="todo-detail-btn"
        id="todo-detail-back-btn"
        onClick={() => navigate(-1)}
        style={{ marginTop: 16 }}
      >
        Back
      </button>
    </div>
  );
}

TodoDetail.propTypes = todoDetailPropTypes;

export default TodoDetail;