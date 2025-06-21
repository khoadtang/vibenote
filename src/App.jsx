import React, { useState, useEffect } from 'react';
import MarkdownTaskInput from './components/MarkdownTaskInput.jsx';
import TaskList from './components/TaskList.jsx';
import { parseProjects } from './utils/markdownParser.js';
import { LocalStorageTaskService } from './storage/localStorageTaskService.js';
import { generateTasks } from './services/aiService.js';

const storage = new LocalStorageTaskService();

export default function App() {
  const [markdown, setMarkdown] = useState('');
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    const loadStored = async () => {
      const all = await storage.readAll();
      setTasks(all);
    };
    loadStored();
  }, []);

  const handleGenerate = async () => {
    try {
      const aiResult = await generateTasks(markdown);
      const parsed = parseProjects(aiResult);

      // merge new tasks with existing ones
      setTasks(prev => {
        const merged = { ...prev };
        Object.entries(parsed).forEach(([project, projectTasks]) => {
          if (!merged[project]) merged[project] = [];
          projectTasks.forEach(text => {
            if (!merged[project].some(t => t.text === text)) {
              const obj = { text, done: false };
              merged[project].push(obj);
              storage.createTask(project, obj);
            }
          });
        });
        return merged;
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate tasks');
    }
  };

  const handleToggle = async (project, idx) => {
    setTasks(prev => {
      const updated = { ...prev };
      const task = { ...updated[project][idx] };
      task.done = !task.done;
      updated[project][idx] = task;
      storage.updateTask(project, idx, task);
      return updated;
    });
  };

  const handleDelete = async (project, idx) => {
    setTasks(prev => {
      const updated = { ...prev };
      updated[project].splice(idx, 1);
      storage.deleteTask(project, idx);
      return updated;
    });
  };

  const handleUpdate = async (project, idx, text) => {
    setTasks(prev => {
      const updated = { ...prev };
      const task = { ...updated[project][idx], text };
      updated[project][idx] = task;
      storage.updateTask(project, idx, task);
      return updated;
    });
  };

  return (
    <div className="app-container">
      <div className="input-panel">
        <MarkdownTaskInput
          value={markdown}
          onChange={setMarkdown}
          onGenerate={handleGenerate}
        />
      </div>
      <div className="tasks-panel">
        <TaskList
          tasksByProject={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
