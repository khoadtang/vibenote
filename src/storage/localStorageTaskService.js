import { TaskStorage } from '../services/storageService.js';

export class LocalStorageTaskService extends TaskStorage {
  constructor() {
    super();
    this.storeKey = 'vibenote-tasks';
    this.tasks = JSON.parse(localStorage.getItem(this.storeKey) || '{}');
    // Migrate legacy string-based tasks to object format
    Object.keys(this.tasks).forEach(project => {
      this.tasks[project] = this.tasks[project].map(t =>
        typeof t === 'string' ? { text: t, done: false } : t
      );
    });
  }

  _save() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.tasks));
  }

  async createTask(project, task) {
    if (!this.tasks[project]) this.tasks[project] = [];
    if (!this.tasks[project].some(t => t.text === task.text)) {
      this.tasks[project].push(task);
      this._save();
    }
  }

  async readTasks(project) {
    return this.tasks[project] || [];
  }

  async readAll() {
    return this.tasks;
  }

  async updateTask(project, taskId, updatedTask) {
    if (this.tasks[project]) {
      this.tasks[project][taskId] = updatedTask;
      this._save();
    }
  }

  async deleteTask(project, taskId) {
    if (this.tasks[project]) {
      this.tasks[project].splice(taskId, 1);
      this._save();
    }
  }
}
