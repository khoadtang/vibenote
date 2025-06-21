import React, { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text || task);

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(editText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onUpdate(editText);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditText(task.text || task);
      setIsEditing(false);
    }
  };

  const taskText = typeof task === 'object' && task.text ? task.text : String(task);
  const isDone = task.done || false;

  return (
    <li className={`task-item${isDone ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleEdit}
          autoFocus
        />
      ) : (
        <span onDoubleClick={handleEdit}>
          {taskText}
        </span>
      )}
      <button onClick={onDelete} className="delete-btn">×</button>
    </li>
  );
}
