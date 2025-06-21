import React, { useState } from 'react';

export default function TaskItem({
  project,
  index,
  task,
  onToggle,
  onDelete,
  onUpdate
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onUpdate(project, index, text);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="task-item" style={{ opacity: task.done ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(project, index)}
      />
      {isEditing ? (
        <input
          className="edit-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={task.done ? 'completed' : ''}
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.text}
        </span>
      )}
      <button
        className="delete-button"
        onClick={() => {
          if (confirm('Delete task?')) onDelete(project, index);
        }}
      >
        🗑
      </button>
    </li>
  );
}
