import React from 'react';
import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasksByProject }) {
  return (
    <div className="task-list">
      {Object.entries(tasksByProject).map(([project, tasks]) => (
        <div key={project} className="project-section">
          <h3>Project: {project}</h3>
          <ul>
            {tasks.map((task, idx) => (
              <TaskItem key={idx} task={task} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
