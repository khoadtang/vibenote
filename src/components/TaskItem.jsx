import React, { useState } from 'react';

export default function TaskItem({ task }) {
  const [done, setDone] = useState(false);
  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={done}
        onChange={() => setDone(!done)}
      />
      <span className={done ? 'completed' : ''}>{task}</span>
    </li>
  );
}
