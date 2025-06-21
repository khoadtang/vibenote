import React, { useState } from 'react';
import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasksByProject }) {
  const [collapsed, setCollapsed] = useState({});

  const toggle = project => {
    setCollapsed(prev => ({ ...prev, [project]: !prev[project] }));
  };

  return (
    <div className="task-list">
      {Object.entries(tasksByProject).map(([project, tasks]) => {
        const isCollapsed = collapsed[project];
        return (
          <div key={project} className="project-section">
            <h3
              className="project-title"
              onClick={() => toggle(project)}
            >
              {project}
              <span className="task-count">({tasks.length})</span>
            </h3>
            {!isCollapsed && (
              <ul>
                {tasks.map((task, idx) => (
                  <TaskItem key={idx} task={task} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
