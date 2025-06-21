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
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadStored = async () => {
      const all = await storage.readAll();
      setTasks(all);
    };
    loadStored();
  }, []);

  const handleGenerate = async () => {
    if (isGenerating) return; // Prevent duplicate calls
    setIsGenerating(true);
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
              const taskObj = { text, done: false };
              merged[project].push(taskObj);
              storage.createTask(project, taskObj);
            }
          });
        });
        return merged;
      });

      // Clear markdown input after generating tasks
      setMarkdown('');

      // Scroll to the last added project after state update
      if (Object.keys(parsed).length > 0) {
        setTimeout(() => {
          const lastProject = Object.keys(parsed).pop();
          const element = document.querySelector(`[data-project="${lastProject}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate tasks');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = async (project, idx) => {
    setTasks(prev => {
      const updated = { ...prev };
      const newTasks = [...updated[project]]; // Create a new array for the project's tasks
      const task = { ...newTasks[idx] };
      task.done = !task.done;
      newTasks[idx] = task;
      updated[project] = newTasks; // Assign the new array to the project
      storage.updateTask(project, idx, task);
      return updated;
    });
  };

  const handleDelete = async (project, idx) => {
    setTasks(prev => {
      const updated = { ...prev };
      if (updated[project] && updated[project][idx]) {
        const newTasks = updated[project].filter((_, i) => i !== idx);
        updated[project] = newTasks;
        storage.deleteTask(project, idx);
      }
      return updated;
    });
  };

  const handleUpdate = async (project, idx, text) => {
    setTasks(prev => {
      const updated = { ...prev };
      if (updated[project] && updated[project][idx]) {
        const newTasks = [...updated[project]];
        const task = { ...newTasks[idx], text };
        newTasks[idx] = task;
        updated[project] = newTasks;
        storage.updateTask(project, idx, task);
      }
      return updated;
    });
  };

  const handleRemoveProject = async (project) => {
    setTasks(prev => {
      const updated = { ...prev };
      delete updated[project];
      storage.deleteProject(project);
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
          isGenerating={isGenerating}
        />
      </div>
      <div className="tasks-panel">
        <TaskList
          tasksByProject={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRemoveProject={handleRemoveProject}
        />
      </div>
    </div>
  );
}
