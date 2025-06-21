import React, { useState } from 'react';
import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasksByProject, onToggle, onDelete, onUpdate, onRemoveProject }) {
  const [collapsed, setCollapsed] = useState({});

  const toggle = project => {
    setCollapsed(prev => ({ ...prev, [project]: !prev[project] }));
  };

  return (
    <div className="task-list">
      {Object.entries(tasksByProject).map(([project, tasks]) => {
        const isCollapsed = collapsed[project];
        return (
          <div key={project} className="project-section" data-project={project}>
            <h3
              className="project-title"
              onClick={() => toggle(project)}
            >
              {'#' + project}
              <span className="task-count">({tasks.length})</span>
              <button className="remove-project-btn" onClick={() => onRemoveProject(project)}>Remove</button>
            </h3>
            {!isCollapsed && (
              <ul>
                {tasks.map((task, idx) => (
                  <TaskItem
                    key={`${project}-${idx}`}
                    task={task}
                    onToggle={() => onToggle(project, idx)}
                    onDelete={() => onDelete(project, idx)}
                    onUpdate={(text) => onUpdate(project, idx, text)}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
