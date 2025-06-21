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
          merged[project] = [...merged[project], ...projectTasks];
        });
        return merged;
      });

      Object.entries(parsed).forEach(([project, projectTasks]) => {
        projectTasks.forEach(task => storage.createTask(project, task));
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate tasks');
    }
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
        <TaskList tasksByProject={tasks} />
      </div>
    </div>
  );
}
